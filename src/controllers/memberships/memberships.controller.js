import Membership from "../../models/Membership.js";

const membershipsController = {
  createMembership: async (req, res) => {
    try {
      const { type, price } = req.body;

      const newMembership = await Membership.create({
        type,
        price,
      });

      res.status(201).json(newMembership);
    } catch (error) {
      res.status(500).json({ message: "Error creating membership", error });
    }
  },

  getAllMemberships: async (req, res) => {
    try {
      const memberships = await Membership.findAll();
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ message: "Error fetching memberships", error });
    }
  },

  getMembershipById: async (req, res) => {
    try {
      const { id } = req.params;
      const membership = await Membership.findByPk(id);
      if (!membership)
        return res.status(404).json({ message: "Membership not found" });

      res.json(membership);
    } catch (error) {
      res.status(500).json({ message: "Error fetching membership", error });
    }
  },

  updateMembership: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, price } = req.body;

      const membership = await Membership.findByPk(id);
      if (!membership)
        return res.status(404).json({ message: "Membership not found" });

      await membership.update({ type, price });
      res.json({ message: "Membership updated", membership });
    } catch (error) {
      res.status(500).json({ message: "Error updating membership", error });
    }
  },

  deleteMembership: async (req, res) => {
    try {
      const { id } = req.params;
      const membership = await Membership.findByPk(id);
      if (!membership)
        return res.status(404).json({ message: "Membership not found" });

      await membership.destroy();
      res.json({ message: "Membership deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting membership", error });
    }
  },
};

export default membershipsController;
