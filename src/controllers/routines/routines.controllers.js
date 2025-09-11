import e from "express";
import Exercise from "../../models/Exercise.js";
import Routine from "../../models/Routine.js";
import RoutineExe from "../../models/RoutineExe.js";

const routinesController = {
  getAllRoutines: async (req, res, next) => {
    try {
      const allRoutines = await Routine.findAll({
        where: {
          disabled: false,
        },
        include: [
          {
            model: Exercise,
            attributes: ["name", "typeEx"],
            as: "exercise",
            through: {
              attributes: ["series", "repetitions"],
            },
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
      console.error(error.mesagge);
      next(error);
    }
  },

  getRoutineById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const routine = await Routine.findByPk(id, {
        where: {
          disabled: false,
        },
        include: [
          {
            model: Exercise,
            attributes: ["name", "typeEx"],
            as: "exercise",
            through: {
              attributes: ["series", "repetitions"],
            },
          },
        ],
      });

      if (!routine) {
        return res.status(404).json({
          success: false,
          msg: "Rutina no encontrada",
        });
      }

      res.status(200).json({
        success: true,
        msg: "Rutina encontrada",
        data: routine,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },

  createRoutine: async (req, res, next) => {
    try {
      const { typeRoutine, descRoutine, exercises } = req.body;

      if (
        !typeRoutine ||
        !descRoutine ||
        !Array.isArray(exercises) ||
        exercises.length === 0
      ) {
        return res.status(400).json({
          success: false,
          msg: "Faltan campos obligatorios",
        });
      }

      const newRoutine = await Routine.create({ typeRoutine, descRoutine });

      for (const exercise of exercises) {
        if (!exercise.id || !exercise.series || !exercise.repetitions) {
          return res.status(400).json({
            error: "Cada ejercicio debe tener id, series y repetitions",
          });
        }

        await RoutineExe.create({
          routineId: newRoutine.id,
          exerciseId: exercise.id,
          series: exercise.series,
          repetitions: exercise.repetitions,
        });
      }

      res.status(201).json({
        success: true,
        msg: "Rutina creada con éxito",
        data: newRoutine,
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

      const exercise = await Exercise.findByPk(id);
      if (!exercise) {
        return res.status(404).json({
          success: false,
          msg: "Rutina no encontrada",
        });
      }

      await exercise.update({ disabled });

      res.status(200).json({
        success: true,
        msg: `Estado de la rutina actualizado a ${
          disabled ? "deshabilitado" : "habilitado"
        }`,
        data: e,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
};

export default routinesController;
