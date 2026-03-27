const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('reservation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  salle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
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
  montant_total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('EN_ATTENTE', 'CONFIRMEE', 'ANNULEE', 'TERMINEE'),
    defaultValue: 'EN_ATTENTE'
  },
  num_tel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mode_paiement: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Reservation;