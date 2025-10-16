// controllers/inscription/inscription.controllers.js
import Activity from "../../models/activities.js";
import Schedule from "../../models/Schedule.js";
import Inscription from "../../models/Inscription.js";
import User from "../../models/User.js";
import { Op } from "sequelize";

const inscriptionController = {
  // Create inscription (activity or schedule)
  createInscription: async (req, res) => {
    try {
      const { userId, activityId, scheduleId, type } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Handle activity inscription
      if (type === "activity") {
        const activity = await Activity.findByPk(activityId);
        if (!activity)
          return res
            .status(404)
            .json({ success: false, message: "Activity not found" });

        if (activity.capacity <= 0)
          return res
            .status(400)
            .json({ success: false, message: "No available spots" });

        const already = await Inscription.findOne({
          where: { userId, type: "activity" },
        });
        if (already)
          return res
            .status(400)
            .json({ success: false, message: "You already have an activity" });

        const inscription = await Inscription.create({
          userId,
          activityId,
          type: "activity",
        });

        activity.capacity -= 1;
        await activity.save();

        return res.json({
          success: true,
          message: `Enrolled in ${activity.name}`,
          inscription,
        });
      }

      // Handle schedule inscription
      if (type === "schedule") {
        const schedule = await Schedule.findByPk(scheduleId);
        if (!schedule)
          return res
            .status(404)
            .json({ success: false, message: "Schedule not found" });

        if (schedule.capacity <= 0)
          return res
            .status(400)
            .json({ success: false, message: "No available spots" });

        // User can't have more than 3 schedules
        const userSchedules = await Inscription.findAll({
          where: { userId, type: "schedule" },
          include: { model: Schedule },
        });

        if (userSchedules.length >= 3)
          return res
            .status(400)
            .json({ success: false, message: "You already have 3 schedules" });

        // User can't have another schedule the same day
        const sameDay = userSchedules.find(
          (insc) => insc.Schedule.day === schedule.day
        );
        if (sameDay)
          return res.status(400).json({
            success: false,
            message: "You already have a schedule that day",
          });

        const inscription = await Inscription.create({
          userId,
          scheduleId,
          type: "schedule",
        });

        schedule.capacity -= 1;
        await schedule.save();

        return res.json({
          success: true,
          message: "Schedule booked successfully",
          inscription,
        });
      }
      // // Handle routine inscription
      // if (type === "routine") {
      //   const routine = await Activity.findByPk(activityId);
      //   if (!routine)
      //     return res
      //       .status(404)
      //       .json({ success: false, message: "Routine not found" });

      //   if (routine.capacity <= 0)
      //     return res
      //       .status(400)
      //       .json({ success: false, message: "No available spots" });

      //   const alreadyRoutine = await Inscription.findOne({
      //     where: { userId, type: "routine" },
      //   });
      //   if (alreadyRoutine)
      //     return res.status(400).json({
      //       success: false,
      //       message: "You already have a routine",
      //     });

      //   const inscription = await Inscription.create({
      //     userId,
      //     activityId,
      //     type: "routine",
      //   });

      //   routine.capacity -= 1;
      //   await routine.save();

      //   return res.json({
      //     success: true,
      //     message: `Routine enrolled successfully`,
      //     inscription,
      //   });
      // }

      return res
        .status(400)
        .json({ success: false, message: "Invalid inscription type" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Database error" });
    }
  },

  // Get all inscriptions of a user
  getInscriptionsByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const inscriptions = await Inscription.findAll({
        where: { userId },
        include: [Activity, Schedule],
      });
      // res.json(inscriptions);
      res.json({ data: inscriptions });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Database error" });
    }
  },

  // Delete inscription
  deleteInscription: async (req, res) => {
    try {
      const { id } = req.params;
      const inscription = await Inscription.findByPk(id, {
        include: [Activity, Schedule],
      });

      if (!inscription)
        return res
          .status(404)
          .json({ success: false, message: "Inscription not found" });

      // Restore capacity
      if (inscription.type === "activity" && inscription.Activity) {
        inscription.Activity.capacity += 1;
        await inscription.Activity.save();
      }

      if (inscription.type === "schedule" && inscription.Schedule) {
        inscription.Schedule.capacity += 1;
        await inscription.Schedule.save();
      }

      await inscription.destroy();
      res.json({ success: true, message: "Inscription removed successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Database error" });
    }
  },
};

export default inscriptionController;
