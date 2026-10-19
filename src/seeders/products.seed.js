import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Las imágenes están en la carpeta uploads/ del back y se sirven en /uploads.
// Los productos que se crean desde el dashboard también guardan solo el nombre del archivo.
const OLD_SUPABASE_HOST = "cgkwvxeecaiaejwsuurm.supabase.co";

const seedProducts = async () => {
  const products = [
    {
      name: "Whey Protein 2lb",
      img: "whey-protein.jpg",
      price: 29999,
      description: "Proteína concentrada de suero de alta calidad.",
      stock: 30,
      category: "Suplementos",
    },
    {
      name: "Creatina Monohidratada 300g",
      img: "creatina.jpg",
      price: 18999,
      description: "Creatina pura para mejorar fuerza y rendimiento.",
      stock: 50,
      category: "Suplementos",
    },
    {
      name: "Cinturón de Levantamiento",
      img: "cinturon-levantamiento.jpg",
      price: 14999,
      description: "Cinturón reforzado para levantamiento pesado.",
      stock: 20,
      category: "Accesorios de Entrenamiento",
    },
    {
      name: "Remera Dry Fit",
      img: "remera-dry-fit.jpg",
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

    // Los productos creados con el seed anterior apuntan al proyecto de Supabase
    // que ya no existe. Se corrigen para que usen la imagen local.
    if (!created && product.img?.includes(OLD_SUPABASE_HOST)) {
      await product.update({ img: data.img });
      console.log(`🖼️ Imagen actualizada: ${product.name}`);
    }

    console.log(
      created
        ? `🏋️ Producto creado: ${product.name}`
        : `✅ Producto ya existía: ${product.name}`
    );
  }
};

export default seedProducts;