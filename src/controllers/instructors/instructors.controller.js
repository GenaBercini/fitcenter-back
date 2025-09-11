import Instructor from "../../models/Instructor.js";

const instructorController = {
  createInstructor: async (req, res) => {
    try {
      const { registration_number } = req.body;

      if (!registration_number) {
        return res.status(400).json({
          success: false,
          msg: "Missing required fields",
        });
      }

      const newInstructor = await Instructor.create({
        registration_number,
      });

      res.status(201).json({
        success: true,
        msg: "Instructor created successfully",
        data: newInstructor,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating instructor", error });
    }
  },

  getAllInstructors: async (req, res) => {
    try {
      const instructors = await Instructor.findAll();
      res.json(instructors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching instructors", error });
    }
  },

  getInstructorById: async (req, res) => {
    try {
      const { id } = req.params;
      const instructor = await Instructor.findByPk(id);
      if (!instructor)
        return res.status(404).json({ message: "Instructor not found" });

      res.json(instructor);
    } catch (error) {
      res.status(500).json({ message: "Error fetching instructor", error });
    }
  },

  updateInstructor: async (req, res) => {
    try {
      const { id } = req.params;
      const { registration_number, instructor_id } = req.body;

      const instructor = await Instructor.findByPk(id);
      if (!instructor)
        return res.status(404).json({ message: "Instructor not found" });

      await instructor.update({ registration_number, instructor_id });
      res.json({ message: "Instructor updated", instructor });
    } catch (error) {
      res.status(500).json({ message: "Error updating instructor", error });
    }
  },

  deleteInstructor: async (req, res) => {
    try {
      const { id } = req.params;
      const instructor = await Instructor.findByPk(id);
      if (!instructor)
        return res.status(404).json({ message: "Instructor not found" });

      await instructor.destroy();
      res.json({ message: "Instructor deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting instructor", error });
    }
  },
};

export default instructorController;
