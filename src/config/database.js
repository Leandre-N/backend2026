const { Sequelize } = require("sequelize");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

console.log("HOST =", process.env.DB_HOST);


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("✅ Connexion réussie à la base de données !"))
  .catch((err) => console.error("❌ Erreur de connexion :", err));

module.exports = sequelize;
