const http = require('http');
const app = require('./src/app');
const sequelize = require('./src/config/database');
require('./src/models');


const PORT = 3000 ;

const server = http.createServer(app);



sequelize.authenticate()
.then(()=>{
    console.log("connection reussi")
    return sequelize.sync({ alter: true });


})

.then(()=>{
    console.log('📦 Synchronisation des modèles réussie !')
    server.listen(PORT,()=> {
    console.log(`server tourne sur http://localhost:${PORT}`)
})

}).catch((error)=>{
    console.error('erreur de connection:',error);
})
