import multer from "multer";
import path from "path";

// Carpeta imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // crea la carpeta  si no existe
  },
  filename: (req, file, cb) => {
    // Genera un nombre único
    const ext = path.extname(file.originalname);
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  },
});

// aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (jpg, jpeg, png)"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
