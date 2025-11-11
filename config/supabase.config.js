import { createClient } from "@supabase/supabase-js";
import User from "../src/models/User.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
export async function createUserImage(supabase, uid, imageBase64) {
  try {
    if (!imageBase64) {
      return { success: false, error: "No image provided" };
    }
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const { data, error: uploadError } = await supabase.storage
      .from("user-images")
      .upload(`public/${uid}.png`, buffer, {
        contentType: "image/png",
        upsert: false,
      });
    if (uploadError) return { success: false, error: uploadError.message };
    const { data: publicUrl, error: urlError } = supabase.storage
      .from("user-images")
      .getPublicUrl(`public/${uid}.png`);
    if (urlError) return { success: false, error: urlError.message };

    return { success: true, url: publicUrl.publicUrl };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateUserImage(supabase, uid, imageBase64) {
  try {
    if (!imageBase64) {
      return { success: false, error: "No image provided" };
    }
    if (uid !== supabase.auth.getUser().data.user.id) {
      return {
        success: false,
        error: "No tienes permiso para actualizar esta imagen",
      };
    }
    const { data: exists, error: existsError } = await supabase.storage
      .from("user-images")
      .list("public", { search: `${uid}.png` });

    if (existsError) return { success: false, error: existsError.message };
    if (!exists || exists.length === 0) {
      return {
        success: false,
        error: "La imagen no existe, no se puede actualizar",
      };
    }

    const { error } = await supabase.storage
      .from("user-images")
      .upload(`public/${uid}.png`, Buffer.from(imageBase64, "base64"), {
        contentType: "image/png",
        upsert: true,
      });

    if (error) return { success: false, error: error.message };

    const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/user-images/${uid}.png`;
    return { success: true, url };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    const user = await User.findOne({ where: { uid: data.user.id } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    req.user = user;
    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al autenticar", error: err.message });
  }
};
