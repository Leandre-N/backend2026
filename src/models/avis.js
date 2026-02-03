const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Avis = sequelize.define('avis', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  salle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  note: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  commentaire: {
    type: DataTypes.TEXT
  }
});

module.exports = Avis;