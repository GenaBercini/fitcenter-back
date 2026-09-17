import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const MembershipPayment = sequelize.define(
  "MembershipPayment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    membershipType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ars",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Paid",
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    stripeInvoiceId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "membership_payments",
    timestamps: true,
  },
);

export default MembershipPayment;
