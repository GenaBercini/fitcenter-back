import Administrator from "../../models/Administrator.js";

const administratorController = {
  createAdministrator: async (req, res) => {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          msg: "Missing required fields",
        });
      }

      const newAdministrator = await Administrator.create({
        user_id,
      });

      res.status(201).json({
        success: true,
        msg: "Administrator created successfully",
        data: newAdministrator,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating administrator", error });
    }
  },

  getAllAdministrators: async (req, res) => {
    try {
      const administrator = await Administrator.findAll();
      res.json(administrator);
    } catch (error) {
      res.status(500).json({ message: "Error fetching administrator", error });
    }
  },

  getAdministratorById: async (req, res) => {
    try {
      const { id } = req.params;
      const administrator = await Administrator.findByPk(id);
      if (!administrator)
        return res.status(404).json({ message: "Administrator not found" });

      res.json(administrator);
    } catch (error) {
      res.status(500).json({ message: "Error fetching administrator", error });
    }
  },

  updateAdministrator: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.body;

      const administrator = await Administrator.findByPk(id);
      if (!administrator)
        return res.status(404).json({ message: "Administrator not found" });

      await administrator.update({ id, user_id });
      res.json({ message: "Administrator updated", administrator });
    } catch (error) {
      res.status(500).json({ message: "Error updating administrator", error });
    }
  },

  deleteAdministrator: async (req, res) => {
    try {
      const { id } = req.params;
      const administrator = await Administrator.findByPk(id);
      if (!administrator)
        return res.status(404).json({ message: "Administrator not found" });

      await administrator.destroy();
      res.json({ message: "Administrator deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting administrator", error });
    }
  },
};

export default administratorController;
