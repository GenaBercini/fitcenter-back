import Activity from "../../models/activities.js";

const activityController = {
  getAllActivities: async (req, res) => {
    try {
      const activities = await Activity.findAll();
      res.send(activities);
    } catch (err) {
      res.status(500).send("Database error");
    }
  },

  getActivityById: async (req, res) => {
    try {
      const activity = await Activity.findByPk(req.params.id);
      if (!activity) return res.status(404).send("Activity not found");
      res.send(activity);
    } catch (err) {
      res.status(500).send("Database error");
    }
  },

  createActivity: async (req, res) => {
    try {
      const { name, startTime, endTime, capacity, instructor } = req.body;
      const newActivity = await Activity.create({
        name,
        startTime,
        endTime,
        capacity,
        instructor,
      });
      res.status(201).send(newActivity);
    } catch (err) {
      res.status(500).send("Database error");
    }
  },

  updateActivity: async (req, res) => {
    try {
      const activity = await Activity.findByPk(req.params.id);
      if (!activity) return res.status(404).send("Activity not found");

      const { name, startTime, endTime, capacity, instructor } = req.body;
      await activity.update({ name, startTime, endTime, capacity, instructor });
      res.send(activity);
    } catch (err) {
      res.status(500).send("Database error");
    }
  },

  deleteActivity: async (req, res) => {
    try {
      const activity = await Activity.findByPk(req.params.id);
      if (!activity) return res.status(404).send("Activity not found");

      await activity.destroy();
      res.send({ message: "Activity deleted", id: req.params.id });
    } catch (err) {
      res.status(500).send("Database error");
    }
  },

  // inscripción en actividad
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
        await activity.save(); // guardamos el nuevo valor
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
      res.status(500).json({ success: false, message: "Database error" });
    }
  },
};

export default activityController;
