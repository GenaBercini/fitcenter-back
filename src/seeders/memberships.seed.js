import Membership from "../models/Membership.js";

// Mismos planes y precios que muestra el front (src/pages/MembershipPlan.jsx)
const memberships = [
  { type: "Basic", monthly_price: 20 },
  { type: "Premium", monthly_price: 30 },
];

const seedMemberships = async () => {
  for (const data of memberships) {
    const [membership, created] = await Membership.findOrCreate({
      where: { type: data.type },
      defaults: data,
    });

    console.log(
      created
        ? `💳 Membresía creada: ${membership.type}`
        : `✅ Membresía ya existía: ${membership.type}`
    );
  }
};

export default seedMemberships;
