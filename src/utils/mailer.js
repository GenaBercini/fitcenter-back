import nodemailer from "nodemailer";

let transporterPromise;

// Arma la conexión con el servidor de mails una sola vez.
// - Si el .env tiene SMTP_HOST (por ejemplo Gmail), usa esa cuenta y el mail llega de verdad.
// - Si no, usa Ethereal: una casilla de prueba que NO entrega el mail a nadie,
//   pero devuelve un link para ver cómo quedó. Sirve para probar sin configurar nada.
const createTransporter = async () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST) {
    const port = Number(SMTP_PORT) || 587;
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
  }

  const testAccount = await nodemailer.createTestAccount();
  console.warn(
    "SMTP no configurado. Los mails le llegan a ethereal"
  );
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
};

export const getTransporter = () => {
  if (!transporterPromise) {
    transporterPromise = createTransporter().catch((err) => {
      transporterPromise = undefined; // si falla, el próx envio lo vuelve a intentar
      throw err;
    });
  }
  return transporterPromise;
};

export const isTestMailer = () => !process.env.SMTP_HOST;

export const getPreviewUrl = (info) => nodemailer.getTestMessageUrl(info);