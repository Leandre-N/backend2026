const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path"); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/api/test", (req, res) => {
  res.json({ message: "Connexion réussie" });
});

app.get('/', (req, res) => {
  res.send('hello');
});

const userRoute = require('./routes/userRoute')
app.use('/api/users', userRoute)

const salleRoutes = require('./routes/salleRoutes')
app.use('/api/salles', salleRoutes)

const reservationRoutes = require('./routes/reservationRoutes')
app.use('/api/reservations', reservationRoutes)

const paiementRoutes = require('./routes/paiementRoutes')
app.use('/api/paiements', paiementRoutes)

const disponibiliteRoutes = require('./routes/disponibiliteRoutes')
app.use('/api/disponibilites', disponibiliteRoutes)

const avisRoutes = require('./routes/avisRoutes')
app.use('/api/avis', avisRoutes)

const equipementRoutes = require('./routes/equipementRoutes')
app.use('/api/equipements', equipementRoutes)

const salleEquipementRoutes = require('./routes/salleEquipementRoutes')
app.use('/api/salle-equipements', salleEquipementRoutes)

const salleImageRoutes = require('./routes/salleImageRoutes')
app.use('/api/salle-images', salleImageRoutes)

const notificationRoutes = require('./routes/notificationRoutes')
app.use('/api/notifications', notificationRoutes)

module.exports = app;