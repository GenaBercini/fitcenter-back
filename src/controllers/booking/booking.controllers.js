// backend/controllers/booking/booking.controller.js
import Booking from "../../models/booking.js"; // Importa el modelo Turnos

const bookingController = {
  // Objeto para agrupar las funciones del controlador
  getAllBooking: async (req, res) => {
    // Función para obtener todos los turnos
    try {
      const booking = await Booking.findAll(); // Obtiene todos los turnos de la base de datos
      res.send(booking); // Envía los turnos como respuesta
    } catch (err) {
      // Maneja errores de la base de datos
      res.status(500).send("Database error");
    }
  },

  getBookingById: async (req, res) => {
    // Función para obtener un turno por ID
    try {
      const booking = await Booking.findByPk(req.params.id); // Busca el turno por ID
      if (!booking) return res.status(404).send("Turno not found"); // Si no se encuentra, envía un error 404
      res.send(booking); // Envía el turno encontrado como respuesta
    } catch (err) {
      // Maneja errores de la base de datos
      res.status(500).send("Database error");
    }
  },

  createBooking: async (req, res) => {
    // Función para crear un nuevo turno
    try {
      const { activity, entry, exit } = req.body; // Obtiene los datos del cuerpo de la petición
      const nuevo = await Booking.create({ activity, entry, exit }); // Crea un nuevo turno en la base de datos
      res.status(201).send(nuevo); // Envía el nuevo turno creado como respuesta
    } catch (err) {
      // Maneja errores de la base de datos
      res.status(500).send("Database error");
    }
  },

  updateBooking: async (req, res) => {
    // Función para actualizar un turno por ID
    try {
      const booking = await Booking.findByPk(req.params.id); // Busca el turno por ID
      if (!booking) return res.status(404).send("Booking not found"); // Si no se encuentra, envía un error 404
      const { activity, entry, exit } = req.body; // Obtiene los datos del cuerpo de la petición
      await booking.update({ activity, entry, exit }); // Actualiza el turno con los nuevos datos
      res.send(booking); // Envía el turno actualizado como respuesta
    } catch (err) {
      // Maneja errores de la base de datos
      res.status(500).send("Database error");
    }
  },

  deleteBooking: async (req, res) => {
    // Función para eliminar un turno por ID
    try {
      const booking = await Booking.findByPk(req.params.id); // Busca el turno por ID
      if (!booking) return res.status(404).send("Booking not found"); // Si no se encuentra, envía un error 404
      await booking.destroy(); // Elimina el turno de la base de datos
      res.send({ message: "Booking deleted", id: req.params.id }); // Envía un mensaje de éxito y el ID del turno eliminado
    } catch (err) {
      // Maneja errores de la base de datos
      res.status(500).send("Database error");
    }
  },
};

export default bookingController;
