import Subsidiary from "../../models/subsidiary.js"; // Importa el modelo Sucursales

const subsidiaryController = {
  // Objeto para agrupar las funciones del controlador
  getAllSubsidiary: async (req, res) => {
    // Función para obtener todas las sucursales
    try {
      const subsidiary = await Subsidiary.findAll(); // Obtiene todas las sucursales de la base de datos
      res.send(subsidiary); // Envía la lista de sucursales como respuesta
    } catch (err) {
      res.status(500).send("Database error"); // Maneja errores de la base de datos
    }
  },

  getSubsidiaryById: async (req, res) => {
    // Función para obtener una sucursal por ID
    try {
      const subsidiary = await Subsidiary.findByPk(req.params.id); // Busca la sucursal por ID
      if (!subsidiary) return res.status(404).send("Subsidiary not found"); // Si no se encuentra, envía un error 404
      res.send(subsidiary); // Envía la sucursal encontrada como respuesta
    } catch (err) {
      res.status(500).send("Database error"); // Maneja errores de la base de datos
    }
  },

  createSubsidiary: async (req, res) => {
    // Función para crear una nueva sucursal
    try {
      const { adress, position } = req.body; // Obtiene los datos del cuerpo de la petición
      const nueva = await Subsidiary.create({ adress, position }); // Crea una nueva sucursal en la base de datos
      res.status(201).send(nueva); // Envía la nueva sucursal creada como respuesta
    } catch (err) {
      res.status(500).send("Database error"); // Maneja errores de la base de datos
    }
  },

  updateSubsidiary: async (req, res) => {
    // Función para actualizar una sucursal por ID
    try {
      const subsidiary = await Subsidiary.findByPk(req.params.id); // Busca la sucursal por ID
      if (!subsidiary) return res.status(404).send("Subsidiary not found"); // Si no se encuentra, envía un error 404
      const { adress, position } = req.body; // Obtiene los datos del cuerpo de la petición
      await subsidiary.update({ adress, position }); // Actualiza la sucursal con los nuevos datos
      res.send(subsidiary); // Envía la sucursal actualizada como respuesta
    } catch (err) {
      res.status(500).send("Database error"); // Maneja errores de la base de datos
    }
  },

  deleteSubsidiary: async (req, res) => {
    // Función para eliminar una sucursal por ID
    try {
      const subsidiary = await Subsidiary.findByPk(req.params.id); // Busca la sucursal por ID
      if (!subsidiary) return res.status(404).send("Sucursal not found"); // Si no se encuentra, envía un error 404
      await subsidiary.destroy(); // Elimina la sucursal de la base de datos
      res.send({ message: "Sucursal deleted", id: req.params.id }); // Envía un mensaje de éxito con el ID eliminado
    } catch (err) {
      res.status(500).send("Database error"); // Maneja errores de la base de datos
    }
  },
};

export default subsidiaryController;
