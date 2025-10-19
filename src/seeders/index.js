import "dotenv/config.js";
import sequelize from "../models/index.js";
import seedUsers from "./users.seed.js";
import seedProducts from "./products.seed.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");

    await sequelize.sync({ alter: true }); 

    console.log("Ejecutando seeds...");
    await seedUsers();
    await seedProducts();

    console.log("Seeds ejecutados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("Error ejecutando seeds:", error);
    process.exit(1);
  }
})();
