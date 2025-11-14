import Category from "../models/Category.js";

const seedCategories = async () => {
  const categories = [
    {
      name: "Suplementos",
      img: "https://example.com/suplementos.jpg",
    },
    {
      name: "Accesorios de Entrenamiento",
      img: "https://example.com/accesorios.jpg",
    },
    {
      name: "Indumentaria Deportiva",
      img: "https://example.com/indumentaria.jpg",
    },
  ];

  for (const data of categories) {
    const [category, created] = await Category.findOrCreate({
      where: { name: data.name },
      defaults: data,
    });

    console.log(
      created
        ? `📁 Categoría creada: ${category.name}`
        : `✅ Categoría ya existía: ${category.name}`
    );
  }
};

export default seedCategories;