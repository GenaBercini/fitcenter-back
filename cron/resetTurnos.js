import cron from "node-cron";
import Schedule from "../src/models/Schedule.js";
import Inscription from "../src/models/Inscription.js";
import User from "../src/models/User.js";

//  CRON: se ejecuta todos los domingos a las 12 PM (hora del servidor)
cron.schedule("0 12 * * 0", async () => {
  try {
    const deletedCount = await Inscription.destroy({
      where: { type: "schedule" },
    });

    const schedules = await Schedule.findAll();

    for (const schedule of schedules) {
      const newCapacity =
        schedule.maxCapacity != null ? schedule.maxCapacity : schedule.capacity;

      schedule.capacity = newCapacity;
      await schedule.save();
    }

    console.log(" Cupos de turnos reiniciados correctamente.");
    console.log(" Reinicio semanal completado.");
  } catch (error) {
    console.error("Error en el reinicio automático de turnos:", error);
  }
});
// Se ejecuta todos los días a las 00:00 hs
cron.schedule("0 0 * * *", async () => {
  console.log("⌛ Ejecutando cron de membresías...");

  const now = new Date();

  try {
    const users = await User.findAll({
      where: {
        membershipEndDate: {
          [Op.lt]: now, // menor a HOY → vencida
        },
        membershipType: {
          [Op.ne]: "Guest", // evitar reescribir Guest
        },
      },
    });

    for (const user of users) {
      user.membershipType = "Guest";
      user.membershipStartDate = null;
      user.membershipEndDate = null;
      await user.save();
    }

    console.log(`✔ ${users.length} membresías cambiadas a Guest`);
  } catch (error) {
    console.error("❌ Error en el cron de membresías:", error);
  }
});
