const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipement = sequelize.define('equipement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Equipement;