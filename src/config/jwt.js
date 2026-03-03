require("dotenv").config();

module.exports = {
  secret: process.env.JWT_SECRET || "votre_cle_secrete",
  expiresIn: "24h"
};
