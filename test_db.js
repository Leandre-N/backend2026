const sequelize = require('./src/config/database');
const User = require('./src/models/user');
const Salle = require('./src/models/salle');

async function checkDb() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion db OK");

    const users = await User.findAll();
    console.log("\n--- UTILISATEURS ---");
    users.forEach(u => console.log(`ID: ${u.id}, Nom: ${u.nom}, Role: ${u.role}`));

    const salles = await Salle.findAll();
    console.log("\n--- SALLES ---");
    salles.forEach(s => console.log(`ID: ${s.id}, Nom: ${s.nom}, Prop_Id: ${s.proprietaire_id}`));

    if (salles.length === 0) {
      console.log("Aucune salle trouvée en base de données.");
    }

  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    process.exit();
  }
}

checkDb();
