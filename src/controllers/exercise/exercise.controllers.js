import Exercise from "../../models/Exercise.js";

const exercisesControllers = {
  getAllExercises: async (req, res, next) => {
    try {
      const allExercises = await Exercise.findAll();

      if (!allExercises.length) {
        return res.status(400).json({
          success: false,
          msg: "Ejercicios no encontrados",
        });
      }

      res.status(200).json({
        success: true,
        msg: "Todos los ejercicios fueron enviados",
        data: allExercises,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },

  getExerciseByid: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          msg: "Falta el ID del ejercicio",
        });
      }

      const exercise = await Exercise.findByPk(id);

      if (!exercise) {
        return res.status(404).json({
          success: false,
          msg: "Ejercicio no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        msg: "categoria encontrada",
        data: exercise,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },

  createExercise: async (req, res, next) => {
    try {
      const { name, typeEx } = req.body;
      if (!name || !typeEx) {
        return res.status(400).json({
          success: false,
          msg: "Faltan campos obligatorios",
        });
      }
      const newExercise = await Exercise.create({ name, typeEx });

      res.status(200).json({
        success: true,
        msg: "Ejercicio creado con exitoso",
        data: newExercise,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  deleteExercise: async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await Exercise.destroy({
        where: { id },
      });

      if (!deleted) {
        return res.status(404).json({ msg: "Ejercicio no encontrado" });
      }

      return res.json({ msg: "Ejercicio eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ msg: "Error al eliminar ejercicio" });
    }
  },
  updateExercise: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, typeEx } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          msg: "Falta el ID del ejercicio",
        });
      }

      if (!name && !typeEx) {
        return res.status(400).json({
          success: false,
          msg: "No hay información para actualizar",
        });
      }

      const exercise = await Exercise.findByPk(id);
      if (!exercise) {
        return res.status(404).json({
          success: false,
          msg: "Ejercicio no encontrado",
        });
      }

      await exercise.update({ name, typeEx });

      res.status(200).json({
        success: true,
        msg: "Ejercicio actualizado",
        data: exercise,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
};

export default exercisesControllers;
