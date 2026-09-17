import Schedule from "../../models/Schedule.js";
import { Op } from "sequelize";

const timeToMinutes = (time) => {
  const [hours, minutes] = String(time).split(":").map(Number);
  return hours * 60 + minutes;
};

const assertNoScheduleOverlap = async ({ id, day, startTime, endTime }) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (!day || Number.isNaN(start) || Number.isNaN(end) || start >= end) {
    return "El horario de inicio debe ser anterior al horario de fin";
  }

  const schedules = await Schedule.findAll({
    where: {
      day,
      disabled: false,
      ...(id ? { id: { [Op.ne]: id } } : {}),
    },
  });

  const overlaps = schedules.some((schedule) => {
    const existingStart = timeToMinutes(schedule.startTime);
    const existingEnd = timeToMinutes(schedule.endTime);
    return start < existingEnd && end > existingStart;
  });

  return overlaps
    ? "Ya existe un turno superpuesto para ese día"
    : null;
};

const scheduleController = {
  getAllSchedules: async (req, res) => {
    try {
      const schedules = await Schedule.findAll(
        req.query.includeInactive === "true"
          ? {}
          : { where: { disabled: false } },
      );
      res.send(schedules);
    } catch (err) {
      res.status(500).send("Database error");
    }
  },

  getScheduleById: async (req, res) => {
    try {
      const schedule = await Schedule.findOne({
        where: {
          id: req.params.id,
          ...(req.query.includeInactive === "true" ? {} : { disabled: false }),
        },
      });
      if (!schedule) return res.status(404).send("Schedule not found");
      res.send(schedule);
    } catch (err) {
      res.status(500).send("Database error");
    }
  },

  createSchedule: async (req, res) => {
    try {
      const { day, startTime, endTime, capacity } = req.body;
      const overlapError = await assertNoScheduleOverlap({
        day,
        startTime,
        endTime,
      });
      if (overlapError) return res.status(400).json({ message: overlapError });
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
      const overlapError = await assertNoScheduleOverlap({
        id: schedule.id,
        day,
        startTime,
        endTime,
      });
      if (overlapError) return res.status(400).json({ message: overlapError });
      await schedule.update({ day, startTime, endTime, capacity });
      res.send(schedule);
    } catch (err) {
      res.status(500).send("Database error");
    }
  },

  statusSchedule: async (req, res) => {
    const { disabled } = req.body;
    if (typeof disabled !== "boolean") {
      return res.status(400).json({ message: "disabled debe ser booleano" });
    }
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    await schedule.update({ disabled });
    res.json(schedule);
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
