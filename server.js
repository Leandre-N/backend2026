const http = require('http');
const app = require('./src/app');
const sequelize = require('./src/config/database');
const { error } = require('console');

const User= require('./src/models/user');
const Salle= require('./src/models/salle');
const Reservation= require('./src/models/reservation');
const Paiement= require('./src/models/paiement');
const SalleImage= require('./src/models/salleImage');
const Avis= require('./src/models/avis');
const Notification = require('./src/models/notification');
const SalleEquipement = require('./src/models/salleEquipement');
const Disponibilite = require('./src/models/disponibilite');




const PORT = 3000 ;

const server = http.createServer(app);

sequelize.authenticate()
.then(()=>{
    console.log("connection reussi")
    return sequelize.sync({ force: true });


})

.then(()=>{
    console.log('📦 Synchronisation des modèles réussie !')
    server.listen(PORT,()=> {
    console.log(`server tourne sur http://localhost:${PORT}`)
})

}).catch((error)=>{
    console.error('erreur de connction:',error);
})
