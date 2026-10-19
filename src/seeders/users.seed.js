import "dotenv/config.js";
import { supabase } from "../../config/supabase.config.js";
import User from "../models/User.js";

const seedUsers = async () => {
  console.log("🌱 Iniciando seed de usuarios con Supabase Auth...");

  const usersSeed = [
    {
      email: "admin@example.com",
      password: "ADmin123",
      first_name: "Gena",
      last_name: "Admin",
      role: "admin",
      membership: "Premium",
      address: "Calle Central 101",
      phone: "555-1111",
    },
    {
      email: "cliente@example.com",
      password: "CLiente123",
      first_name: "María",
      last_name: "Cliente",
      role: "client",
      address: "Avenida Libertad 222",
      phone: "555-2222",
    },
    {
      email: "profesor@example.com",
      password: "PRofesor123",
      first_name: "Carlos",
      last_name: "Profesor",
      role: "professor",
      membership: "Premium",
      registration_number: "PR-1234",
      address: "Calle del Saber 77",
      phone: "555-3333",
    },
  ];

  for (const userOfSeed of usersSeed) {
    try {
      const { data: existingAuth } = await supabase.auth.admin.listUsers();
      const userExists = existingAuth?.users?.find(
        (user) => user.email === userOfSeed.email
      );

      let uid;

      if (!userExists) {
        const { data, error } = await supabase.auth.admin.createUser({
          email: userOfSeed.email,
          password: userOfSeed.password,
          email_confirm: true,
        });

        if (error) {
          console.error(`❌ Error creando en Supabase: ${userOfSeed.email} — ${error.message}`);
          continue;
        }

        uid = data.user.id;
        console.log(`✅ Usuario creado en Supabase: ${userOfSeed.email}`);
      } else {
        uid = userExists.id;
        console.log(`⚡ Usuario ya existe en Supabase: ${userOfSeed.email}`);
      }

      const [user, created] = await User.findOrCreate({
        where: { email: userOfSeed.email },
        defaults: {
          ...userOfSeed,
          uid,
          image_url: "https://bit.ly/broken-link",
          banned: false,
        },
      });

      console.log(
        created
          ? `✅ Usuario agregado a DB: ${userOfSeed.email}`
          : `⚡ Usuario ya estaba en DB: ${userOfSeed.email}`
      );
    } catch (err) {
      console.error(`💥 Error en usuario ${userOfSeed.email}:`, err.message);
    }
  }

  console.log("🎉 Seed de usuarios finalizado.");
};

export default seedUsers;
