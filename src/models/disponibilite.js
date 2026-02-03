const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Disponibilite = sequelize.define('disponibilite', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    salle_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    creneau: {
        type: DataTypes.ENUM('JOUR', 'SOIREE'),
        allowNull: false
    },
    statut: {
        type: DataTypes.ENUM('LIBRE', 'RESERVE'),
        defaultValue: 'LIBRE'
    }
});

module.exports = Disponibilite;