import Schedule from "../../models/Schedule.js";

const scheduleController = {
  getAllSchedules: async (req, res) => {
    try {
      const schedules = await Schedule.findAll();
      res.send(schedules);
    } catch (err) {
      res.status(500).send("Database error");
    }
  },

  getScheduleById: async (req, res) => {
    try {
      const schedule = await Schedule.findByPk(req.params.id);
      if (!schedule) return res.status(404).send("Schedule not found");
      res.send(schedule);
    } catch (err) {
      res.status(500).send("Database error");
    }
  },

  createSchedule: async (req, res) => {
    try {
      const { day, startTime, endTime, capacity } = req.body;
      const newSchedule = await Schedule.create({
        day,
        startTime,
        endTime,
        capacity,
      });
      res.status(201).send(newSchedule);
    } catch (err) {
      res.status(500).send("Database error");
    }
  },

  updateSchedule: async (req, res) => {
    try {
      const schedule = await Schedule.findByPk(req.params.id);
      if (!schedule) return res.status(404).send("Schedule not found");

      const { day, startTime, endTime, capacity } = req.body;
      await schedule.update({ day, startTime, endTime, capacity });
      res.send(schedule);
    } catch (err) {
      res.status(500).send("Database error");
    }
  },

  deleteSchedule: async (req, res) => {
    try {
      const schedule = await Schedule.findByPk(req.params.id);
      if (!schedule) return res.status(404).send("Schedule not found");

      await schedule.destroy();
      res.send({ message: "Schedule deleted", id: req.params.id });
    } catch (err) {
      res.status(500).send("Database error");
    }
  },
};

export default scheduleController;
