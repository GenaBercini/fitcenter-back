import Category from "../../models/Category.js";
import fs from "fs";
import path from "path";

const categoriesController = {
    getAllCategories: async (req, res, next) => {
        try {
            const allCategories = await Category.findAll({

            });

            if (!allCategories) {
                return res.status(404).json({
                    success: false,
                    msg: "Categorías no encontradas"
                });
            }

            res.status(200).json({
                success: true,
                msg: "Todas las categorias fueron envidas",
                data: allCategories
            })
        } catch (error) {
            console.log(error.message)
            next(error);
        }
    },
    getCategoryById: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    msg: "Falta el ID de la categoría"
                });
            }
            
            const category = await Category.findByPk(id, {
                where: {
                    disabled: false
                }
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    msg: "Categoría no encontrada"
                });
            }

            res.status(200).json({
                success: true,
                msg: "Categoría encontrada",
                data: category
            });
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    },
    createCategory: async (req, res, next) => {
        try {

            console.log("req.body", req.body);
            console.log("req.files", req.file);

            const { name, active } = req.body;
            const { filename } = req.file;

            if (!name || !active || !filename) {
                return res.status(400).json({
                    success: false,
                    msg: "Faltan campos obligatorios"
                });
            }
            const newCategory = await Category.create({ name, img: filename, active });

            res.status(200).json({
                success: true,
                msg: "Categoría creada con éxito",
                data: newCategory
            });
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    },

    updateCategory: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, active, lastImg } = req.body;
            const filename = req.file ? req.file.filename : lastImg;

            console.log(req.body);


            if (filename != null && lastImg != filename) {
                const filePath = path.join("uploads", lastImg);

                fs.access(filePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(filePath, (err) => {
                            if (err) console.error("Error al borrar imagen antigua:", err);
                            else console.log("Imagen anterior eliminada:", lastImg);
                        });
                    }
                });
            }
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    msg: "Falta el ID de la categoría"
                });
            }

            if (!name && !filename && !active) {
                return res.status(400).json({
                    success: false,
                    msg: "No hay información para actualizar"
                });
            }

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    msg: "Categoría no encontrada"
                });
            }

            await category.update({ name, img: filename, disabled:active });

            res.status(200).json({
                success: true,
                msg: "Categoría actualizada correctamente",
                data: category
            });
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    },
    statusCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { disabled } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    msg: "Falta el ID de la categoría"
                });
            }

            if (disabled === undefined) {
                return res.status(400).json({
                    success: false,
                    msg: "Falta el estado de la categoría"
                });
            }

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    msg: "Categoría no encontrada"
                });
            }

            await category.update({ disabled });

            res.status(200).json({
                success: true,
                msg: `Estado de la categoría actualizado a ${disabled ? 'deshabilitada' : 'habilitada'}`,
                data: category
            });
        } catch (error) {
            console.error(error.message);
            next(error);
        }
    }
};

export default categoriesController;

