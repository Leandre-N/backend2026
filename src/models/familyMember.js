const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FamilyMember = sequelize.define('family_member', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  family_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  member_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM("parent", "child", "tutor", "other"),
    defaultValue: "other",
  },

  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = FamilyMember;
