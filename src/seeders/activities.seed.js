import Activity from "../models/Activity.js";
import User from "../models/User.js";

// Los nombres coinciden con los filtros de la página de actividades del front
// (Hilado, CrossFit, Yoga y Zumba). Funcional es la clase nueva del blog.
const activities = [
  {
    name: "Hilado",
    description: "Ciclismo indoor con música. Trabaja resistencia y piernas.",
    startTime: "08:00:00",
    endTime: "09:00:00",
    capacity: 20,
  },
  {
    name: "Yoga",
    description: "Posturas, respiración y elongación para todos los niveles.",
    startTime: "10:00:00",
    endTime: "11:00:00",
    capacity: 18,
  },
  {
    name: "CrossFit",
    description: "Entrenamiento funcional de alta intensidad en circuitos.",
    startTime: "18:00:00",
    endTime: "19:00:00",
    capacity: 15,
  },
  {
    name: "Zumba",
    description: "Clase de baile aeróbico con ritmos latinos.",
    startTime: "19:00:00",
    endTime: "20:00:00",
    capacity: 25,
  },
  {
    name: "Funcional",
    description: "Ejercicios con el peso del cuerpo y elementos, para todos los niveles.",
    startTime: "20:00:00",
    endTime: "21:00:00",
    capacity: 20,
  },
];

const seedActivities = async () => {
  // Cada actividad necesita un instructor (usuario con rol "instructor")
  const instructor = await User.findOne({ where: { role: "instructor" } });
  if (!instructor) {
    console.log(
      "❌ No hay ningún usuario con rol instructor: no se crearon actividades. " +
        "Agregá un instructor en users.seed.js y volvé a correr el seed."
    );
    return;
  }

  for (const data of activities) {
    const [activity, created] = await Activity.findOrCreate({
      where: { name: data.name },
      defaults: { ...data, instructorId: instructor.id },
    });

    console.log(
      created
        ? `🤸 Actividad creada: ${activity.name}`
        : `✅ Actividad ya existía: ${activity.name}`
    );
  }
};

export default seedActivities;
