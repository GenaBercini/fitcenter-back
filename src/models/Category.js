import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Category = sequelize.define(
  'Category',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
  },
);

Category.associate = (models)=> { 
  Category.hasMany(models.Product, {
    foreignKey: 'categoryId',
    as: 'products',
  });
}

export default Category;
