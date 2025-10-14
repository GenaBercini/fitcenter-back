import Activity from "../../models/activities.js";
import Inscription from "../../models/inscription.js";

const inscriptionController = {
  // Crear inscripción
  createInscription: async (req, res) => {
    try {
      const { activityId, userName } = req.body;

      // Buscar actividad
      const activity = await Activity.findByPk(activityId);
      if (!activity) {
        return res
          .status(404)
          .json({ success: false, message: "Actividad no encontrada" });
      }

      // Validar cupo
      if (activity.capacity <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "No quedan cupos disponibles" });
      }

      // Evitar doble inscripción
      const already = await Inscription.findOne({
        where: { activityId, userName },
      });
      if (already) {
        return res.status(400).json({
          success: false,
          message: "Ya estás inscripto en esta actividad",
        });
      }

      // Crear inscripción
      const inscription = await Inscription.create({ activityId, userName });

      // Restar cupo
      activity.capacity -= 1;
      await activity.save();

      return res.json({
        success: true,
        message: `Inscripción confirmada en ${activity.name}`,
        inscription,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Error en la base de datos" });
    }
  },

  // Obtener inscripciones de un usuario
  getInscriptionsByUser: async (req, res) => {
    try {
      const { userName } = req.params;
      const inscriptions = await Inscription.findAll({
        where: { userName },
        include: { model: Activity }, // incluye datos de la actividad
      });

      return res.json(inscriptions);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Error en la base de datos" });
    }
  },
  deleteInscription: async (req, res) => {
    try {
      const { id } = req.params;

      // Buscar inscripción
      const inscription = await Inscription.findByPk(id);
      if (!inscription) {
        return res
          .status(404)
          .json({ success: false, message: "Inscripción no encontrada" });
      }

      // Buscar la actividad asociada
      const activity = await Activity.findByPk(inscription.activityId);

      // Borrar inscripción
      await inscription.destroy();

      // Devolver cupo
      if (activity) {
        activity.capacity += 1;
        await activity.save();
      }

      res.json({
        success: true,
        message: "Inscripción eliminada y cupo restituido",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Database error" });
    }
  },
};

export default inscriptionController;
