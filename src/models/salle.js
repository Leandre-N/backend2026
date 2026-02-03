const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Salle = sequelize.define('salle', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  proprietaire_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  ville: {
    type: DataTypes.STRING,
    allowNull: false
  },
  adresse: {
    type: DataTypes.STRING
  },
  latitude: {
    type: DataTypes.FLOAT
  },
 longitude: {
    type: DataTypes.FLOAT
  },
  capacite: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    defaultValue: 'ACTIVE'
  }
});

module.exports = Salle;