import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Professor = sequelize.define(
  'Professor',
  {
    registration_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
);

export default Professor;
