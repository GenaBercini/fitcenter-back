import {DataTypes} from 'sequelize';
import sequelize from '../../config/database.js';

const Routine = sequelize.define(
    'Routine',
    {
        typeRoutine:{
            type: DataTypes.STRING,
            allowNull: false
        },
        descRoutine:{
            type: DataTypes.STRING,
            allowNull: false
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
    },
);

Routine.associate = (models) =>{
    Routine.belongsToMany(models.Exercise,{
        through: models.RoutineExe,
        foreignKey:'routineId',
        other: 'exerciseId',
        as: 'exercise'
    });
}

export default Routine;