import Activity from "../../models/Activity.js";
import User from "../../models/User.js";

const activityController = {
  getAllActivities: async (req, res) => {
    try {
      const activities = await Activity.findAll({
        include: [
          {
            model: User,
            as: "instructor",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
      });
      res.status(200).json(activities);
    } catch (err) {
      console.error("Error al obtener actividades:", err);
      res.status(500).send("Database error");
    }
  },

  getActivityById: async (req, res) => {
    try {
      const activity = await Activity.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "instructor",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
      });

      if (!activity) return res.status(404).send("Activity not found");
      res.json(activity);
    } catch (err) {
      console.error("Error al obtener actividad:", err);
      res.status(500).send("Database error");
    }
  },
  // createActivity: async (req, res) => {
  //   try {
  //     const { name, startTime, endTime, capacity, instructorId, description } =
  //       req.body;

  //     if (!name || !instructorId || !startTime || !endTime || !capacity) {
  //       return res.status(400).send("Faltan datos obligatorios");
  //     }

  //     const newActivity = await Activity.create({
  //       name,
  //       startTime,
  //       endTime,
  //       capacity,
  //       description,
  //       instructorId,
  //     });

  //     res.status(201).json(newActivity);
  //   } catch (err) {
  //     console.error("Error al crear actividad:", err);
  //     res.status(500).send("Database error");
  //   }
  // },
  createActivity: async (req, res) => {
    try {
      const { name, startTime, endTime, capacity, instructorId, description } =
        req.body;

      if (!name || !instructorId || !startTime || !endTime || !capacity) {
        return res.status(400).send("Faltan datos obligatorios");
      }

      const newActivity = await Activity.create({
        name,
        startTime,
        endTime,
        capacity,
        description,
        instructorId,
      });

      const activityWithInstructor = await Activity.findByPk(newActivity.id, {
        include: [
          {
            model: User,
            as: "instructor",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
      });

      res.status(201).json(activityWithInstructor);
    } catch (err) {
      console.error("Error al crear actividad:", err);
      res.status(500).send("Database error");
    }
  },

  updateActivity: async (req, res) => {
    try {
      const activity = await Activity.findByPk(req.params.id);
      if (!activity) return res.status(404).send("Activity not found");

      const { name, startTime, endTime, capacity, description } = req.body;
      await activity.update({
        name,
        startTime,
        endTime,
        capacity,
        description,
      });

      res.json(activity);
    } catch (err) {
      console.error("Error al actualizar actividad:", err);
      res.status(500).send("Database error");
    }
  },

  deleteActivity: async (req, res) => {
    try {
      const activity = await Activity.findByPk(req.params.id);
      if (!activity) return res.status(404).send("Activity not found");

      await activity.destroy();
      res.json({ message: "Activity deleted", id: req.params.id });
    } catch (err) {
      console.error("Error al eliminar actividad:", err);
      res.status(500).send("Database error");
    }
  },

  inscribeActivity: async (req, res) => {
    try {
      const { id } = req.params;
      const activity = await Activity.findByPk(id);

      if (!activity) {
        return res
          .status(404)
          .json({ success: false, message: "Activity not found" });
      }

      if (activity.capacity > 0) {
        activity.capacity -= 1;
        await activity.save();
        return res.json({
          success: true,
          message: `Inscripción confirmada en ${activity.name}`,
          activity,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: `No quedan cupos en ${activity.name}`,
        });
      }
    } catch (err) {
      console.error("Error en inscripción:", err);
      res.status(500).json({ success: false, message: "Database error" });
    }
  },
};

export default activityController;
