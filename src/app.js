const express = require("express");
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    res.send('hello');
});

app.use((req, res, next) => {
  req.user = { 
    id: 1, 
    role: 'CLIENT' 
  };
  next();
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