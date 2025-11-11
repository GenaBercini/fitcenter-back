import Product from "../models/Product.js";

const seedProducts = async () => {
  const products = [
    {
      name: "Laptop Gamer X-15",
      img: "https://example.com/laptop.jpg",
      price: 1299.99,
      description: "Laptop de alto rendimiento para gaming y trabajo.",
      stock: 10,
    },
    {
      name: "Auriculares Bluetooth Pro",
      img: "https://example.com/headphones.jpg",
      price: 199.99,
      description: "Sonido envolvente, cancelación de ruido y 20h de batería.",
      stock: 50,
    },
    {
      name: "Monitor UltraWide 34''",
      img: "https://example.com/monitor.jpg",
      price: 499.99,
      description: "Resolución QHD y diseño curvo para máxima inmersión.",
      stock: 20,
    },
    {
      name: "Teclado Mecánico RGB",
      img: "https://example.com/keyboard.jpg",
      price: 89.99,
      description: "Switches rojos, retroiluminación RGB y diseño ergonómico.",
      stock: 35,
    },
  ];

  for (const data of products) {
    const [product, created] = await Product.findOrCreate({
      where: { name: data.name },
      defaults: data,
    });

    console.log(created ? `🛍️ Producto creado: ${product.name}` : `✅ Producto ya existía: ${product.name}`);
  }
};


export default seedProducts;
