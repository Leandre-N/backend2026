const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SalleImage = sequelize.define('salle_image', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  salle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = SalleImage;