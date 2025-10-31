import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Administrator = sequelize.define(
  'Administrator',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
);

export default Administrator;
