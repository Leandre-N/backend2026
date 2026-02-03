const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SalleEquipement = sequelize.define('salle_equipement', {
    salle_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    equipement_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantite: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    timestamps: false
});

module.exports = SalleEquipement;