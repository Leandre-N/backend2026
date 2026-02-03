const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Paiement = sequelize.define('paiement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  reservation_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  montant: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  methode: {
    type: DataTypes.ENUM('MTN', 'ORANGE'),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('ACOMPTE', 'TOTAL'),
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('EN_COURS', 'PAYE', 'ECHEC'),
    defaultValue: 'EN_COURS'
  },
  reference_transaction: {
    type: DataTypes.STRING
  }
});

module.exports = Paiement;