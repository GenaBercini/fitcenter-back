import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const User = sequelize.define(
  "User",
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("professor", "instructor", "admin", "client"),
      allowNull: false,
    },
    registration_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

export default User;
