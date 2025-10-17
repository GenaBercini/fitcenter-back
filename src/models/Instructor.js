import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Instructor = sequelize.define(
  'Instructor',
  {
    registration_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
);

export default Instructor;
