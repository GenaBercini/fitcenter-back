import cron from "node-cron";
import Schedule from "../src/models/Schedule.js";
import Inscription from "../src/models/Inscription.js";

//  CRON: se ejecuta todos los domingos a las 12 PM (hora del servidor)
cron.schedule("0 12 * * 0", async () => {
  console.log("Reinicio automático de cupos de turnos iniciado...");

  try {
    //  Eliminar solo las inscripciones de tipo "schedule"
    // ------------------------------------------------------
    const deletedCount = await Inscription.destroy({
      where: { type: "schedule" },
    });
    console.log(` ${deletedCount} inscripciones de turnos eliminadas.`);

    // Reiniciar los cupos de los Schedules
    // ------------------------------------------------------
    // Cada turno recupera su capacidad original desde "maxCapacity".
    const schedules = await Schedule.findAll();

    for (const schedule of schedules) {
      // Si maxCapacity está definido, se usa ese valor.
      // Si no existe, se mantiene el valor actual (para evitar nulos).
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
