import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
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
    updateProduct: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, price, description, stock, img, categoryId } = req.body;
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

            if (!name && !price && !stock && !img && !categoryId) {
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
                price,
                description,
                stock,
                img,
                category: categoryFounded
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
            const { name, price, description, stock, img, categoryId } = req.body;

            if (!name || !price || !stock || !img || !categoryId) {
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
                price,
                description,
                stock,
                img,
                category: categoryFounded
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
    statusProduct: async (req, res, next) => {
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
