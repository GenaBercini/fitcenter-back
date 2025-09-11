import User from "../../models/User.js";
import {
  supabase,
  updateUserImage,
  createUserImage,
} from "../../utils/supabase.config.js";
import ErrorResponse from "../../utils/errorHandler.js";

const userController = {
  createUser: async (req, res, next) => {
    try {
      const {
        first_name,
        last_name,
        password,
        address,
        phone,
        email,
        role,
        registration_number,
        image,
      } = req.body;

      if (!email || !role || !password) {
        return next(
          new ErrorResponse("Email, rol y contraseña son obligatorios", 400)
        );
      }

      if (role === "professor" && !registration_number) {
        return next(
          new ErrorResponse("Un profesor debe tener un número de registro", 400)
        );
      }

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return next(new ErrorResponse(error.message, 400));

      res.cookie("sb-access-token", data.session?.access_token || "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24, // 1 día
      });

      const result = await createUserImage(supabase, data.user.id, image);
      if (!result.success)
        return next(new ErrorResponse("Error al subir imagen", 400));

      const newUser = await User.create({
        first_name,
        last_name,
        address,
        phone,
        email,
        });

      res.status(201).json({
        success: true,
        msg: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
    },
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.findAll();
      res.status(201).json({
        success: true,
        message: "Usuarios obtenidos correctamente",
        data: users,
      });
    } catch (error) {
      next(error);
    }
    },
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) return next(new ErrorResponse("ID no puede ser nulo", 400));

      const user = await User.findByPk(id);
      if (!user) return next(new ErrorResponse("Usuario no encontrado", 404));

      res.status(201).json({
        success: true,
        message: "Usuario obtenido correctamente",
        data: user,
      });
    } catch (error) {
      next(error);
    }
    },
  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        first_name,
        last_name,
        address,
        phone,
        email,
        role,
        registration_number,
        image,
      } = req.body;

      if (!id) return next(new ErrorResponse("ID no puede ser nulo", 400));

      if (
        !first_name &&
        !last_name &&
        !address &&
        !phone &&
        !email &&
        !role &&
        !registration_number &&
        !image
      ) {
        return next(
          new ErrorResponse("Debes modificar al menos un campo", 400)
        );
      }

      const user = await User.findByPk(id);
      if (!user) return next(new ErrorResponse("Usuario no encontrado", 404));

      let result;
      if (image) {
        result = await updateUserImage(supabase, user.uid, image);
        if (!result.success)
          return next(new ErrorResponse("Error al actualizar imagen", 400));
      }

      await user.update({
        first_name: first_name || user.first_name,
        last_name: last_name || user.last_name,
        address: address || user.address,
        phone: phone || user.phone,
        email: email || user.email,
        role: role || user.role,
        registration_number: registration_number || user.registration_number,
        image_url: image ? result.url : user.image_url,
      });

      res.status(201).json({
        success: true,
        message: "Usuario actualizado correctamente",
        data: user,
      });
    } catch (error) {
      next(error);
    }
    },
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) return next(new ErrorResponse("ID no puede ser nulo", 400));

      const user = await User.findByPk(id);
      if (!user) return next(new ErrorResponse("Usuario no encontrado", 404));

      await user.destroy();
      res.status(201).json({
        success: true,
        message: "Usuario eliminado correctamente",
      });
    } catch (error) {
      next(error);
    }
  },

  loginUser: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return next(
          new ErrorResponse("Email y contraseña son obligatorios", 400)
        );
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return next(new ErrorResponse(error.message, 400));

      res.cookie("sb-access-token", data.session?.access_token || "", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
      });

      const userDB = await User.findOne({ where: { uid: data.user.id } });
      if (!userDB) return next(new ErrorResponse("Usuario no encontrado", 404));

      res.json({
        success: true,
        message: "Usuario logueado correctamente",
        data: userDB,
      });
    } catch (error) {
      next(error);
    }
  },

  sessionUser: async (req, res, next) => {
    try {
      const token = req.cookies["sb-access-token"];
      if (!token) return next(new ErrorResponse("No autenticado", 401));

      const { data, error } = await supabase.auth.getUser(token);
      if (error) return next(new ErrorResponse(error.message, 401));

      const userDB = await User.findOne({ where: { uid: data.user.id } });
      if (!userDB) return next(new ErrorResponse("Usuario no encontrado", 404));
      res.json({
        success: true,
        message: "Sesion encontrada",
        data: userDB,
      });
    } catch (error) {
      next(error);
    }
  },

  logoutUser: async (req, res) => {
    try {
      res.clearCookie("sb-access-token");
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },
  googleLogin: async (req, res, next) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: "http://localhost:5173/" },
      });

      if (error) return next(new ErrorResponse(error.message, 400));

      res.redirect(data.url);
    } catch (error) {
      next(error);
    }
  },
  googleSave: async (req, res, next) => {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ error: "Token requerido" });

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error) return res.status(401).json({ error: error.message });

      let userDB = await User.findOne({ where: { uid: user.id } });
      if (!userDB) {
        userDB = await User.create({
          uid: user.id,
          email: user.email,
          first_name: user.user_metadata?.full_name || "",
          role: "client",
          image_url: user.user_metadata?.avatar_url || null,
        });
      }

      res.cookie("sb-access-token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });

      res.json({
        success: true,
        message: "Usuario de Google guardado",
        data: userDB,
      });
    } catch (error) {
      next(error);
    }
    },

}