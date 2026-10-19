import Exercise from "../models/Exercise.js";
import Routine from "../models/Routine.js";
import User from "../models/User.js";

// typeEx es el grupo muscular o el tipo de ejercicio.
// routine es la rutina a la que pertenece (por su typeRoutine). Cada ejercicio
// puede estar en una sola rutina; los que tienen routine: null quedan libres
// para que un profesor los agregue a la rutina que quiera.
const exercises = [
  { name: "Sentadilla con peso corporal", typeEx: "Piernas", routine: "Principiantes" },
  { name: "Flexiones de brazos", typeEx: "Pecho", routine: "Principiantes" },
  { name: "Plancha", typeEx: "Core", routine: "Principiantes" },
  { name: "Bicicleta fija", typeEx: "Cardio", routine: "Principiantes" },

  { name: "Sentadilla con barra", typeEx: "Piernas", routine: "Fuerza" },
  { name: "Peso muerto", typeEx: "Espalda", routine: "Fuerza" },
  { name: "Press de banca", typeEx: "Pecho", routine: "Fuerza" },
  { name: "Press militar", typeEx: "Hombros", routine: "Fuerza" },

  { name: "Remo con barra", typeEx: "Espalda", routine: "Hipertrofia" },
  { name: "Zancadas con mancuernas", typeEx: "Piernas", routine: "Hipertrofia" },
  { name: "Curl de bíceps", typeEx: "Brazos", routine: "Hipertrofia" },
  { name: "Fondos en paralelas", typeEx: "Brazos", routine: "Hipertrofia" },

  { name: "Cinta de correr", typeEx: "Cardio", routine: "Cardio y resistencia" },
  { name: "Burpees", typeEx: "Cardio", routine: "Cardio y resistencia" },
  { name: "Salto a la soga", typeEx: "Cardio", routine: "Cardio y resistencia" },

  { name: "Dominadas", typeEx: "Espalda", routine: null },
  { name: "Abdominales crunch", typeEx: "Core", routine: null },
];

const seedExercises = async () => {
  const professor = await User.findOne({ where: { role: "professor" } });
  if (!professor) {
    console.log("❌ No hay ningún usuario con rol professor: no se crearon ejercicios.");
    return;
  }

  for (const { routine: routineName, ...data } of exercises) {
    let routineId = null;
    if (routineName) {
      const routine = await Routine.findOne({ where: { typeRoutine: routineName } });
      if (!routine) {
        console.log(`⚠️ No se encontró la rutina "${routineName}": ${data.name} queda sin rutina.`);
      } else {
        routineId = routine.id;
      }
    }

    const [exercise, created] = await Exercise.findOrCreate({
      where: { name: data.name },
      defaults: { ...data, routineId, professorId: professor.id },
    });

    console.log(
      created
        ? `🏋️ Ejercicio creado: ${exercise.name}`
        : `✅ Ejercicio ya existía: ${exercise.name}`
    );
  }
};

export default seedExercises;
