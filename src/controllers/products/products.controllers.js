import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";

const productsController = {
    getAllProducts: async (req, res, next) => {
        try {
            const allProducts = await Product.findAll({
                where: {
                    disabled: false,
                    stock: { [Op.gte]: 1 } // Stock mayor o igual a 1
                },
                include: [{
                    model: Category,
                    attributes: ['id', 'name'],
                    as: 'category'
                }]
            });

            if (!allProducts.length) {
                return res.status(404).json({
                    success: false,
                    msg: "No se encontraron productos"
                });
            }

            res.status(200).json({
                success: true,
                msg: "Todos los productos fueron enviados",
                data: allProducts
            });
        } catch (error) {
            console.error(error.message);
            next(error);
        }
    },
    getProductById: async (req, res, next) => {
       try {
            const { id } = req.params;
            const product = await Product.findByPk(id,{
                where: {
                    disabled: false,
                    stock: { [Op.gte]: 1 } // Stock mayor o igual a 1
                },
                include: [{
                    model: Category,
                    attributes: ['id', 'name'],
                    as: 'category'
                }]
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    msg: "Producto no encontrado"
                });
            }

            res.status(200).json({
                success: true,
                msg: "Producto encontrado",
                data: product
            });
        } catch (error) {
            console.error(error.message);
            next(error);
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, description, stock, active, categoryId, lastImg } = req.body;
            const { filename } = req.file;


            if (lastImg != filename) {
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
                    msg: "Falta el ID del producto"
                });
            }

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    msg: "Producto no encontrado"
                });
            }

            if (!name && !price && !description && !stock && !active && !filename && !categoryId) {
                return res.status(400).json({
                    success: false,
                    msg: "No hay información para actualizar"
                });
            }
             
            const categoryFounded = await Category.findByPk(categoryId);
            
            if (!categoryFounded) {
                return res.status(404).json({
                    success: false,
                    msg: "Categoría no encontrada"
                });
            }

            // Podriamos validar si son string vacios osea no se cambian todos, solo los que realmente son distintos
            await product.update({
                name,
                img: filename,
                price,
                description,
                stock,
                active,
                categoryId,
            });

            res.status(200).json({
                success: true,
                msg: "Producto actualizado correctamente",
                data: product
            });
        } catch (error) {
            console.error(error.message);
            next(error);
        }
    },
    createProduct: async (req, res, next) => {
        try {
            //console.log("req", req);
            
            console.log("req.body", req.body);
            console.log("req.files", req.file);

            const { name, price, description, stock, active, categoryId } = req.body;
            const { filename } = req.file;

            if (!name || !price || !stock || !filename || !active || !categoryId || !description) {
                return res.status(400).json({
                    success: false,
                    msg: "Faltan campos obligatorios"
                });
            }

            const categoryFounded = await Category.findByPk(categoryId);
            
            if (!categoryFounded) {
                return res.status(404).json({
                    success: false,
                    msg: "Categoría no encontrada"
                });
            }

            const newProduct = await Product.create({
                name,
                img: filename,
                price,
                description,
                stock,
                active,
                categoryId,
                //category: categoryFounded
            });

            res.status(201).json({
                success: true,
                msg: "Producto creado con éxito",
                data: newProduct
            });
        } catch (error) {
            console.error(error.message);
            next(error);
        }
    },
    statusProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const { disabled } = req.body;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    msg: "Falta el ID del producto"
                });
            }

            if (disabled === undefined) {
                return res.status(400).json({
                    success: false,
                    msg: "Falta el estado del producto"
                });
            }

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    msg: "Producto no encontrado"
                });
            }

            await product.update({ disabled });

            res.status(200).json({
                success: true,
                msg: `Estado del producto actualizado a ${disabled ? 'deshabilitado' : 'habilitado'}`,
                data: product
            });
        } catch (error) {
            console.error(error.message);
            next(error);
        }
    }
};

export default productsController;
