import e from "express";
import Exercise from "../../models/Exercise.js";
import Routine from "../../models/Routine.js";
import User from "../../models/User.js";

const routinesController = {
  getAllRoutines: async (req, res, next) => {
    try {
      const allRoutines = await Routine.findAll({
        where: { disabled: false },
        include: [
          {
            model: Exercise,
            as: "exercises",
            attributes: ["id", "name", "typeEx"],
          },
          {
            model: User,
            as: "professor",
            attributes: ["first_name", "last_name"],
          },
        ],
      });

      if (!allRoutines.length) {
        return res.status(404).json({
          success: false,
          msg: "No se encontraron rutinas",
        });
      }

      res.status(200).json({
        success: true,
        msg: "Todas las rutinas fueron enviadas",
        data: allRoutines,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
  deleteRoutine: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          msg: "Falta el ID de la rutina",
        });
      }

      const routine = await Routine.findByPk(id);

      if (!routine || routine.disabled) {
        return res.status(404).json({
          success: false,
          msg: "Rutina no encontrada o ya está deshabilitada",
        });
      }

      await Exercise.update({ routineId: null }, { where: { routineId: id } });

      await routine.update({ disabled: true });

      res.status(200).json({
        success: true,
        msg: "Rutina eliminada (deshabilitada) con éxito",
        data: routine,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },

  getRoutineById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const routine = await Routine.findOne({
        where: { id, disabled: false },
        include: [
          {
            model: Exercise,
            as: "exercises",
            attributes: ["id", "name", "typeEx"],
          },
          {
            model: User,
            as: "professor",
            attributes: ["first_name", "last_name"],
          },
        ],
      });

      if (!routine) {
        return res.status(404).json({
          success: false,
          msg: "Rutina no encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Rutina encontrada",
        data: routine,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },

  updateRoutine: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { typeRoutine, descRoutine, exercises } = req.body;

      const routine = await Routine.findByPk(id);

      if (!routine) {
        return res.status(404).json({
          success: false,
          msg: "Rutina no encontrada",
        });
      }

      await routine.update({
        typeRoutine,
        descRoutine,
      });

      await Exercise.update({ routineId: null }, { where: { routineId: id } });

      if (Array.isArray(exercises) && exercises.length > 0) {
        await Exercise.update({ routineId: id }, { where: { id: exercises } });
      }
      const updatedRoutine = await Routine.findByPk(id, {
        include: [
          {
            model: Exercise,
            as: "exercises",
            attributes: ["id", "name", "typeEx"],
          },
          {
            model: User,
            as: "professor",
            attributes: ["first_name", "last_name"],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        msg: "Rutina actualizada con éxito",
        data: updatedRoutine,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
  createRoutine: async (req, res, next) => {
    try {
      const { typeRoutine, descRoutine, professorId, exercises } = req.body;

      if (!typeRoutine || !descRoutine) {
        return res.status(400).json({
          success: false,
          msg: "Faltan campos obligatorios",
        });
      }
      const newRoutine = await Routine.create({
        typeRoutine,
        descRoutine,
        professorId,
      });

      if (Array.isArray(exercises) && exercises.length > 0) {
        await Exercise.update(
          { routineId: newRoutine.id },
          { where: { id: exercises } }
        );
      }

      const routineWithRelations = await Routine.findByPk(newRoutine.id, {
        include: [
          {
            model: Exercise,
            as: "exercises",
            attributes: ["id", "name", "typeEx"],
          },
          {
            model: User,
            as: "professor",
            attributes: ["first_name", "last_name"],
          },
        ],
      });

      res.status(201).json({
        success: true,
        msg: "Rutina creada con éxito",
        data: routineWithRelations,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },

  statusRoutine: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { disabled } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          msg: "Falta el ID de la rutina",
        });
      }

      if (disabled === undefined) {
        return res.status(400).json({
          success: false,
          msg: "Falta el estado de la rutina",
        });
      }

      const routine = await Routine.findByPk(id);
      if (!routine) {
        return res
          .status(404)
          .json({ success: false, msg: "Rutina no encontrada" });
      }

      await routine.update({ disabled });

      res.status(200).json({
        success: true,
        msg: `Estado de la rutina actualizado a ${
          disabled ? "deshabilitado" : "habilitado"
        }`,
        data: routine,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
};

export default routinesController;
