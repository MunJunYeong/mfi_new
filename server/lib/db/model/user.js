const {DataTypes, Sequelize} = require('sequelize');

const create = async (sequelize) => {
    const userTable = await sequelize.define('user', {
        // Model attributes are defined here
        userIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        id: {
            type: DataTypes.STRING
            // allowNull defaults to true
        },
        pw: {
            type: DataTypes.STRING
        },
        nickName: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        created: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
        },
        status: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.STRING
        }
    }, {
        // Other model options go here   timestamps: false,
        freezeTableName: true,
        timestamps: false,
    });

    userTable.associate = function (models) {
        userTable.hasMany(models.idea, 
            {foreignKey: 'userIdx',
        });
        userTable.hasMany(models.comment, {
            foreignKey: 'userIdx'
        });
    };

    return userTable;
}
module.exports = create;  