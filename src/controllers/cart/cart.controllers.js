// Listar carrito de un usuario
export const getCart = async (req, res) => {
  try {
    const { userId } = req.query; // o req.user.id si usás JWT
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: Product,
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener carrito", error });
  }
};

// Agregar producto
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let item = await CartItem.findOne({ where: { userId, productId } });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({ userId, productId, quantity });
    }

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ message: "Error agregando al carrito", error });
  }
};

// Eliminar producto
export const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.body; // o req.user.id
    const { productId } = req.params;

    await CartItem.destroy({ where: { userId, productId } });
    res.json({ success: true, message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando producto", error });
  }
};