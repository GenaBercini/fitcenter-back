import {DataTypes} from 'sequelize';
import sequelize from '../../config/database.js';

const Exercise = sequelize.define(
    'Exercise',
    {  
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        typeEx:{
            type:DataTypes.STRING,
            allowNull:false
        },
    },
    {
    },
);


Exercise.associate = (models) =>{
    Exercise.belongsToMany(models.Routine,{
        through: models.RoutineExe,
        foreignKey:'exerciseId',
        other: 'routineId',
        as: 'exercise'
    })
}

export default Exercise;