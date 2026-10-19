import "dotenv/config.js";
import sequelize from "../models/index.js";
import seedUsers from "./users.seed.js";
import seedProducts from "./products.seed.js";
import seedCategories from "./categories.seed.js";
import seedMemberships from "./memberships.seed.js";
import seedActivities from "./activities.seed.js";
import seedRoutines from "./routines.seed.js";
import seedExercises from "./exercises.seed.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");

    await sequelize.sync({ alter: true });

    console.log("Ejecutando seeds...");
    await seedUsers();
    await seedCategories();
    await seedProducts();
    await seedMemberships();
    // Las actividades necesitan un instructor y las rutinas un profesor,
    // así que van después de los usuarios. Los ejercicios, después de las rutinas.
    await seedActivities();
    await seedRoutines();
    await seedExercises();

    console.log("Seeds ejecutados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("Error ejecutando seeds:", error);
    process.exit(1);
  }
})();
