import Client from "../../models/Client.js";

const clientController = {
  createClient: async (req, res) => {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          msg: "Missing required fields",
        });
      }

      const newClient = await Client.create({
        user_id,
      });

      res.status(201).json({
        success: true,
        msg: "Client created successfully",
        data: newClient,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating client", error });
    }
  },

  getAllClients: async (req, res) => {
    try {
      const clients = await Client.findAll();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Error fetching clients", error });
    }
  },

  getClientById: async (req, res) => {
    try {
      const { id } = req.params;
      const client = await Client.findByPk(id);
      if (!client) return res.status(404).json({ message: "Client not found" });

      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Error fetching client", error });
    }
  },

  deleteClient: async (req, res) => {
    try {
      const { id } = req.params;
      const client = await Client.findByPk(id);
      if (!client) return res.status(404).json({ message: "Client not found" });

      await client.destroy();
      res.json({ message: "Client deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting client", error });
    }
  },
};
export default clientController;
