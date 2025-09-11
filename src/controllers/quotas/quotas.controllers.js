import Quota from "../../models/Quota.js";
import Branch from "../../models/Branch.js";
import Shift from "../../models/Shift.js";

const quotaController = {
  getAllQuota: async (req, res, next) => {
    try {
      const allQuota = await Quota.findAll({
        where: {
          disabled: false,
          capacity: { [Op.lt]: 30 },
        },
        include: [
          { model: Branch, as: "branch" },
          { model: Shift, as: "shifts" },
        ],
      });

      if (!allQuota.length) {
        return res.status(404).json({
          success: false,
          msg: "No se encontraron cupos.",
        });
      }

      res.status(200).json({
        success: true,
        msg: "Cupos encontrados.",
        data: allQuota,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },

  getQuotaById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const quota = await Quota.findByPk(id, {
        include: [
          { model: Branch, as: "branch" },
          { model: Shift, as: "shifts" },
        ],
      });
      if (!quota || quota.disabled || quota.capacity >= 30) {
        return res.status(404).json({
          success: false,
          msg: "Cupo no encontrado.",
        });
      }

      if (!quota) {
        return res.status(404).json({
          success: false,
          msg: "Cupo no encontrado.",
        });
      }

      res.status(200).json({
        success: true,
        msg: "Cupo encontrado.",
        data: quota,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },

  createQuota: async (req, res, next) => {
    try {
      const { branchId, shiftId, capacity } = req.body;

      if (!branchId || !shiftId || !Array.isArray(shiftId) || !capacity) {
        return res.status(400).json({
          success: false,
          msg: "Faltan campos obligatorios: branchId, shiftId o capacity.",
        });
      }

      if (capacity > 30 || capacity < 1) {
        return res.status(400).json({
          success: false,
          msg: "La capacidad debe ser entre 1 y 30.",
        });
      }

      const branchFounded = await Branch.findByPk(branchId);
      if (!branchFounded) {
        return res.status(404).json({
          success: false,
          msg: "Sucursal no encontrada.",
        });
      }

      const shiftFounded = await Shift.findAll({
        where: {
          id: {
            [Op.in]: shiftId,
          },
        },
      });

      if (shiftFounded.length !== shiftId.length) {
        return res.status(404).json({
          success: false,
          msg: "Uno o más turnos no fueron encontrados.",
        });
      }

      const quota = await Quota.create({ branchId, capacity });

      // Asociar los turnos
      await quota.setShifts(shiftId);

      const result = await Quota.findByPk(quota.id, {
        include: [
          { model: Branch, as: "branch" },
          { model: Shift, as: "shifts" },
        ],
      });

      res.status(201).json({
        success: true,
        msg: "Cupo creado correctamente.",
        data: result,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },

  //   updateQuota: async (req, res, next) => {
  //   try {
  //     const { id } = req.params;
  //     const { branchId, shiftId, capacity } = req.body;

  //     const quota = await Quota.findByPk(id);
  //     if (!quota) {
  //       return res.status(404).json({
  //         success: false,
  //         msg: "Cupo no encontrado.",
  //       });
  //     }

  //     if (capacity !== undefined) {
  //       if (capacity < 1 || capacity > 30) {
  //         return res.status(400).json({
  //           success: false,
  //           msg: "La capacidad debe ser entre 1 y 30.",
  //         });
  //       }
  //       quota.capacity = capacity;
  //     }

  //     if (branchId !== undefined) {
  //       const branchFounded = await Branch.findByPk(branchId);
  //       if (!branchFounded) {
  //         return res.status(404).json({
  //           success: false,
  //           msg: "Sucursal no encontrada.",
  //         });
  //       }
  //       quota.branchId = branchId;
  //     }

  //     await quota.save();

  //     if (shiftId && Array.isArray(shiftId)) {
  //       const shiftFounded = await Shift.findAll({
  //         where: {
  //           id: { [Op.in]: shiftId },
  //         },
  //       });

  //       if (shiftFounded.length !== shiftId.length) {
  //         return res.status(404).json({
  //           success: false,
  //           msg: "Uno o más turnos no fueron encontrados.",
  //         });
  //       }

  //       await quota.setShifts(shiftId);
  //     }

  //     const updated = await Quota.findByPk(id, {
  //       include: [
  //         { model: Branch, as: "branch" },
  //         { model: Shift, as: "shifts" },
  //       ],
  //     });

  //     res.status(200).json({
  //       success: true,
  //       msg: "Cupo actualizado correctamente.",
  //       data: updated,
  //     });
  //   } catch (error) {
  //     console.error(error.message);
  //     next(error);
  //   }
  // },

  statusQuota: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { disabled } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          msg: "Falta el ID del cupo.",
        });
      }

      if (disabled === undefined) {
        return res.status(400).json({
          success: false,
          msg: "Falta el estado del cupo (disabled).",
        });
      }

      const quota = await Quota.findByPk(id);
      if (!quota) {
        return res.status(404).json({
          success: false,
          msg: "Cupo no encontrado.",
        });
      }

      await quota.update({ disabled });

      res.status(200).json({
        success: true,
        msg: `Estado del cupo actualizado a ${
          disabled ? "deshabilitado" : "habilitado"
        }.`,
        data: quota,
      });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  },
};

export default quotaController;
