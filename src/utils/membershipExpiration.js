import cron from "node-cron";
import User from "../models/User.js";
import { Op } from "sequelize";

const membershipExpiration = async () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("⏳ Verificando membresías vencidas...");

    const now = new Date();

    const expiredUsers = await User.findAll({
      where: {
        membershipType: "PRO",
        membershipEndDate: { [Op.lte]: now },
      },
    });

    for (const user of expiredUsers) {
      user.membershipType = "INVITADO";
      user.membershipStartDate = null;
      user.membershipEndDate = null;
      await user.save();

      console.log(`Usuario ${user.email} degradado a INVITADO`);
    }

    console.log("✅ Revisión de membresías completada");
  });
};

export default membershipExpiration;
