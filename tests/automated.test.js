import test from 'node:test';
import assert from 'node:assert/strict';

process.env.STRIPE_SECRET_KEY ??= 'sk_test_dummy';
process.env.SUPABASE_URL ??= 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY ??= 'dummy-service-role-key';

const { default: ErrorResponse } = await import('../src/utils/errorConstructor.js');
const { default: errorHandler } = await import('../src/utils/errorHandler.js');
const { calculateCartTotal } = await import('../src/utils/calculateCartTotal.js');
const { default: Cart } = await import('../src/models/Cart.js');
const { default: CartItem } = await import('../src/models/CartItem.js');
const cron = (await import('node-cron')).default;
const { default: User } = await import('../src/models/User.js');
const { default: membershipExpiration } = await import('../src/utils/membershipExpiration.js');
const { default: cartController } = await import('../src/controllers/cart/cart.controllers.js');
const { authenticateUser, supabase } = await import('../config/supabase.config.js');
const { default: express } = await import('express');


test('1) ErrorResponse crea el error con el estado esperado', () => {
  const error = new ErrorResponse('Email inválido', 400);

  assert.equal(error.message, 'Email inválido');
  assert.equal(error.statusCode, 400);
  assert.equal(error.success, false);
  assert.ok(error instanceof Error);
});

test('2) errorHandler responde el payload de error con el formato de la API', () => {
  let statusCode;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  errorHandler(new ErrorResponse('Validación fallida', 422), {}, res, () => {});

  assert.equal(statusCode, 422);
  assert.deepEqual(res.payload, {
    status: 'error',
    success: false,
    message: 'Validación fallida',
  });
});

test('3) calculateCartTotal suma los subtotales y actualiza el total del carrito', async () => {
  const originalFindAll = CartItem.findAll;
  const originalUpdate = Cart.update;

  try {
    CartItem.findAll = async () => [{ subtotal: 10 }, { subtotal: 20 }, { subtotal: 5 }];
    Cart.update = async (values, options) => {
      assert.equal(values.total, 35);
      assert.equal(options.where.id, 42);
      return [1];
    };

    await calculateCartTotal(42);
  } finally {
    CartItem.findAll = originalFindAll;
    Cart.update = originalUpdate;
  }
});

test('4) membershipExpiration baja de estado a usuarios PRO vencidos', async () => {
  const originalSchedule = cron.schedule;
  const originalFindAll = User.findAll;

  try {
    const scheduledJobs = [];
    cron.schedule = (expression, callback) => {
      scheduledJobs.push({ expression, callback });
      return { expression };
    };

    const expiredUser = {
      email: 'expired@example.com',
      membershipType: 'PRO',
      membershipStartDate: new Date('2024-01-01'),
      membershipEndDate: new Date(Date.now() - 1000 * 60 * 60),
      async save() {
        this.membershipType = 'INVITADO';
        this.membershipStartDate = null;
        this.membershipEndDate = null;
      },
    };

    User.findAll = async () => [expiredUser];
    membershipExpiration();

    assert.equal(scheduledJobs.length, 1);
    assert.equal(scheduledJobs[0].expression, '0 0 * * *');

    await scheduledJobs[0].callback();
    assert.equal(expiredUser.membershipType, 'INVITADO');
    assert.equal(expiredUser.membershipStartDate, null);
    assert.equal(expiredUser.membershipEndDate, null);
  } finally {
    cron.schedule = originalSchedule;
    User.findAll = originalFindAll;
  }
});

test('5) getOrCreateActiveCart crea un carrito cuando el usuario no tiene uno abierto', async () => {
  const originalUserFindByPk = User.findByPk;
  const originalCartFindOne = Cart.findOne;
  const originalCartCreate = Cart.create;

  try {
    User.findByPk = async () => ({ id: 7, email: 'user@example.com' });
    Cart.findOne = async () => null;
    Cart.create = async (payload) => ({ id: 99, ...payload });

    const req = { params: { userId: 7 } };
    const res = {
      status(code) {
        this.code = code;
        return this;
      },
      json(payload) {
        this.payload = payload;
        return this;
      },
    };

    await cartController.getOrCreateActiveCart(req, res, () => {});

    assert.equal(res.code, 201);
    assert.equal(res.payload.data.id, 99);
    assert.equal(res.payload.data.userId, 7);
    assert.equal(res.payload.success, true);
  } finally {
    User.findByPk = originalUserFindByPk;
    Cart.findOne = originalCartFindOne;
    Cart.create = originalCartCreate;
  }
});

test('6) flujo de integración: login exitoso y acceso a ruta protegida', async () => {
  const originalSignIn = supabase.auth.signInWithPassword;
  const originalGetUser = supabase.auth.getUser;
  const originalFindOne = User.findOne;

  const app = express();
  app.use(express.json());

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const userDB = await User.findOne({ where: { uid: data.user.id } });
    if (!userDB) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.cookie('sb-access-token', data.session.access_token, {
      httpOnly: true,
      sameSite: 'lax',
    });

    return res.json({
      success: true,
      token: data.session.access_token,
      data: userDB,
    });
  });

  app.get('/profile', authenticateUser, (req, res) => {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  });

  let server;

  try {
    supabase.auth.signInWithPassword = async ({ email, password }) => {
      assert.equal(email, 'demo@fitcenter.com');
      assert.equal(password, '123456');
      return {
        data: {
          user: { id: 'user-123' },
          session: { access_token: 'token-abc' },
        },
        error: null,
      };
    };

    supabase.auth.getUser = async (token) => {
      assert.equal(token, 'token-abc');
      return {
        data: { user: { id: 'user-123' } },
        error: null,
      };
    };

    User.findOne = async ({ where }) => {
      assert.deepEqual(where, { uid: 'user-123' });
      return {
        id: 10,
        uid: 'user-123',
        email: 'demo@fitcenter.com',
        role: 'client',
      };
    };

    server = app.listen(0);
    const port = server.address().port;

    const loginResponse = await fetch(`http://127.0.0.1:${port}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@fitcenter.com', password: '123456' }),
    });

    assert.equal(loginResponse.status, 200);
    const loginData = await loginResponse.json();
    assert.equal(loginData.success, true);
    assert.equal(loginData.token, 'token-abc');

    const profileResponse = await fetch(`http://127.0.0.1:${port}/profile`, {
      headers: { Authorization: 'Bearer token-abc' },
    });

    assert.equal(profileResponse.status, 200);
    const profileData = await profileResponse.json();
    assert.equal(profileData.success, true);
    assert.equal(profileData.user.email, 'demo@fitcenter.com');
  } finally {
    supabase.auth.signInWithPassword = originalSignIn;
    supabase.auth.getUser = originalGetUser;
    User.findOne = originalFindOne;

    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  }
});
