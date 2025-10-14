// import { Router } from "express"; // Importa Router de Express
// import bookingController from "../controllers/booking/booking.controllers.js";

// const router = Router(); // Crea una instancia de Router

// router.get("/", bookingController.getAllBooking); // Ruta para obtener todos los turnos
// router.get("/:id", bookingController.getBookingById); // Ruta para obtener un turno por ID
// router.post("/", bookingController.createBooking); // Ruta para crear un nuevo turno
// router.put("/:id", bookingController.updateBooking); // Ruta para actualizar un turno por ID
// router.delete("/:id", bookingController.deleteBooking); // Ruta para eliminar un turno por ID

// export default router; // Exporta el router para usarlo en otras partes de la aplicación

import { Router } from "express";
import scheduleController from "../controllers/schedule/schedule.controllers.js";

const router = Router();

// GET all schedules
router.get("/", scheduleController.getAllSchedules);

// GET schedule by ID
router.get("/:id", scheduleController.getScheduleById);

// POST new schedule
router.post("/", scheduleController.createSchedule);

// PUT update schedule
router.put("/:id", scheduleController.updateSchedule);

// DELETE schedule
router.delete("/:id", scheduleController.deleteSchedule);

export default router;
