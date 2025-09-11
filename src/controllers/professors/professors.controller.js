import Professor from "../../models/Professor.js";

const professorController = {
  createProfessor: async (req, res) => {
    try {
      const { registration_number, user_id } = req.body;

      if (!registration_number || !user_id) {
        return res.status(400).json({
          success: false,
          msg: "Missing required fields",
        });
      }

      const newProfessor = await Professor.create({
        registration_number,
        user_id,
      });

      res.status(201).json({
        success: true,
        msg: "Professor created successfully",
        data: newProfessor,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating professor", error });
    }
  },

  getAllProfessors: async (req, res) => {
    try {
      const professors = await Professors.findAll();
      res.json(professors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching professors", error });
    }
  },

  getProfessorsById: async (req, res) => {
    try {
      const { id } = req.params;
      const professor = await Professor.findByPk(id);
      if (!professor)
        return res.status(404).json({ message: "Professor not found" });

      res.json(professor);
    } catch (error) {
      res.status(500).json({ message: "Error fetching professor", error });
    }
  },

  updateProfessor: async (req, res) => {
    try {
      const { id } = req.params;
      const { registration_number, user_id } = req.body;

      const professor = await Professor.findByPk(id);
      if (!professor)
        return res.status(404).json({ message: "Professor not found" });

      await professor.update({ registration_number, user_id });
      res.json({ message: "Professor updated", professor });
    } catch (error) {
      res.status(500).json({ message: "Error updating professor", error });
    }
  },

  deleteProfessor: async (req, res) => {
    try {
      const { id } = req.params;
      const professor = await Professor.findByPk(id);
      if (!professor)
        return res.status(404).json({ message: "Professor not found" });

      await professor.destroy();
      res.json({ message: "Professor deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting professor", error });
    }
  },
};

export default professorController;
