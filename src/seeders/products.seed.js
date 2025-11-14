import Product from "../models/Product.js";
import Category from "../models/Category.js";

const seedProducts = async () => {
  const products = [
    {
      name: "Whey Protein 2lb",
      img: "https://example.com/whey.jpg",
      price: 29999,
      description: "Proteína concentrada de suero de alta calidad.",
      stock: 30,
      category: "Suplementos",
    },
    {
      name: "Creatina Monohidratada 300g",
      img: "https://example.com/creatina.jpg",
      price: 18999,
      description: "Creatina pura para mejorar fuerza y rendimiento.",
      stock: 50,
      category: "Suplementos",
    },
    {
      name: "Cinturón de Levantamiento",
      img: "https://example.com/cinturon.jpg",
      price: 14999,
      description: "Cinturón reforzado para levantamiento pesado.",
      stock: 20,
      category: "Accesorios de Entrenamiento",
    },
    {
      name: "Remera Dry Fit",
      img: "https://example.com/remera.jpg",
      price: 8999,
      description: "Remera deportiva transpirable y ligera.",
      stock: 40,
      category: "Indumentaria Deportiva",
    },
  ];

  for (const data of products) {
    const category = await Category.findOne({
      where: { name: data.category },
    });

    if (!category) {
      console.log(`❌ No se encontró la categoría: ${data.category}`);
      continue;
    }

    const [product, created] = await Product.findOrCreate({
      where: { name: data.name },
      defaults: {
        name: data.name,
        img: data.img,
        price: data.price,
        description: data.description,
        stock: data.stock,
        categoryId: category.id,
      },
    });

    console.log(
      created
        ? `🏋️ Producto creado: ${product.name}`
        : `✅ Producto ya existía: ${product.name}`
    );
  }
};

export default seedProducts;