import Routine from "../models/Routine.js";
import User from "../models/User.js";

// typeRoutine se usa como nombre de la rutina en el front.
// descRoutine es un texto corto (el campo admite hasta 255 caracteres).
const routines = [
  {
    typeRoutine: "Principiantes",
    descRoutine: "Adaptación para tu primer mes: 3 días por semana, cuerpo completo y técnica.",
  },
  {
    typeRoutine: "Fuerza",
    descRoutine: "Ejercicios básicos con cargas progresivas, 3 días por semana y descansos largos.",
  },
  {
    typeRoutine: "Hipertrofia",
    descRoutine: "Ganar masa muscular: 4 días por semana dividiendo por grupos musculares.",
  },
  {
    typeRoutine: "Cardio y resistencia",
    descRoutine: "Mejorar la capacidad aeróbica con intervalos y circuitos, 3 días por semana.",
  },
];

const seedRoutines = async () => {
  // Las rutinas las arma un profesor (usuario con rol "professor")
  const professor = await User.findOne({ where: { role: "professor" } });
  if (!professor) {
    console.log("❌ No hay ningún usuario con rol professor: no se crearon rutinas.");
    return;
  }

  for (const data of routines) {
    const [routine, created] = await Routine.findOrCreate({
      where: { typeRoutine: data.typeRoutine },
      defaults: { ...data, professorId: professor.id },
    });

    console.log(
      created
        ? `📋 Rutina creada: ${routine.typeRoutine}`
        : `✅ Rutina ya existía: ${routine.typeRoutine}`
    );
  }
};

export default seedRoutines;
