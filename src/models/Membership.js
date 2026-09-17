import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Membership = sequelize.define(
  'Membership',
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthly_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
);

export default Membership;