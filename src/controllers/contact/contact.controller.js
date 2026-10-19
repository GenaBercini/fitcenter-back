import ErrorResponse from "../../utils/errorConstructor.js";
import { getTransporter, isTestMailer, getPreviewUrl } from "../../utils/mailer.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Evita que alguien meta HTML en el mail escribiendo etiquetas en el mensaje
const escapeHtml = (text) =>
  text.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );

const contactController = {
  sendMessage: async (req, res, next) => {
    const name = String(req.body?.name ?? "").replace(/[\r\n]+/g, " ").trim();
    const email = String(req.body?.email ?? "").trim();
    const message = String(req.body?.message ?? "").trim();

    if (!name || !email || !message) {
      return next(new ErrorResponse("Completá tu nombre, tu email y el mensaje", 400));
    }
    if (name.length > 100) {
      return next(new ErrorResponse("El nombre puede tener hasta 100 caracteres", 400));
    }
    if (!EMAIL_REGEX.test(email)) {
      return next(new ErrorResponse("El email no es válido", 400));
    }
    if (message.length > 2000) {
      return next(new ErrorResponse("El mensaje puede tener hasta 2000 caracteres", 400));
    }

    try {
      const transporter = await getTransporter();
      const info = await transporter.sendMail({
        from: {
          name: "FitCenter Web",
          address: process.env.SMTP_USER || "no-reply@fitcenter.com",
        },
        to: process.env.CONTACT_TO || process.env.SMTP_USER || "contacto@fitcenter.com",
        // Al tocar "Responder" en el mail, la respuesta le llega a quien escribió
        replyTo: { name, address: email },
        subject: `Nuevo mensaje de contacto de ${name}`,
        text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
        html: `
          <p><strong>Nombre:</strong> ${escapeHtml(name)}<br>
          <strong>Email:</strong> ${escapeHtml(email)}</p>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        `,
      });

      if (isTestMailer()) {
        console.log("Vista previa del mail de prueba:", getPreviewUrl(info));
      }

      res.status(200).json({ success: true, message: "Mensaje enviado" });
    } catch (error) {
      console.error("Error enviando el mail de contacto:", error.message);
      next(new ErrorResponse("No pudimos enviar el mensaje. Probá de nuevo en unos minutos.", 502));
    }
  },
};

export default contactController;