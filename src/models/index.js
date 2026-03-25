const sequelize = require('../config/database')
const User = require('./user')
const Salle = require('./salle')
const Reservation = require('./reservation')
const Paiement = require('./paiement')
const Disponibilite = require('./disponibilite')
const Avis = require('./avis')
const Equipement = require('./equipement')
const SalleEquipement = require('./salleEquipement')
const SalleImage = require('./salleImage')
const Notification = require('./notification')
const Message = require('./message')

User.hasMany(Salle, { foreignKey: 'proprietaire_id', as: 'salles' })
Salle.belongsTo(User, { foreignKey: 'proprietaire_id', as: 'user' }) // ✅ as: 'user'


User.hasMany(Reservation, { foreignKey: 'user_id' })
Reservation.belongsTo(User, { foreignKey: 'user_id' })


Salle.hasMany(Reservation, { foreignKey: 'salle_id' })
Reservation.belongsTo(Salle, { foreignKey: 'salle_id' })


Reservation.hasMany(Paiement, { foreignKey: 'reservation_id' })
Paiement.belongsTo(Reservation, { foreignKey: 'reservation_id' })


Salle.hasMany(Disponibilite, { foreignKey: 'salle_id' })
Disponibilite.belongsTo(Salle, { foreignKey: 'salle_id' })


Salle.hasMany(Avis, { foreignKey: 'salle_id' })
Avis.belongsTo(Salle, { foreignKey: 'salle_id' })


User.hasMany(Avis, { foreignKey: 'user_id' })
Avis.belongsTo(User, { foreignKey: 'user_id' })


Salle.belongsToMany(Equipement, {
  through: SalleEquipement,
  foreignKey: 'salle_id',
  otherKey: 'equipement_id'
})
Equipement.belongsToMany(Salle, {
  through: SalleEquipement,
  foreignKey: 'equipement_id',
  otherKey: 'salle_id'
})


Salle.hasMany(SalleImage, { foreignKey: 'salle_id' })
SalleImage.belongsTo(Salle, { foreignKey: 'salle_id' })


User.hasMany(Notification, { foreignKey: 'user_id' })
Notification.belongsTo(User, { foreignKey: 'user_id' })


User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' })
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' })
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' })
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' })

Salle.hasMany(Message, { foreignKey: 'salle_id' })
Message.belongsTo(Salle, { foreignKey: 'salle_id' })

module.exports = {
  sequelize,
  User,
  Salle,
  Reservation,
  Paiement,
  Disponibilite,
  Avis,
  Equipement,
  SalleEquipement,
  SalleImage,
  Notification,
  Message
}