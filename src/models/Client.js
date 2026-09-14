import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Client = sequelize.define(
  'Client',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
);

export default Client;
