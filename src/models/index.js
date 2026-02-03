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

// === Associations ===

// User ↔ Salle (1 propriétaire → N salles)
User.hasMany(Salle, { foreignKey: 'proprietaire_id' })
Salle.belongsTo(User, { foreignKey: 'proprietaire_id' })

// User ↔ Reservation (1 client → N réservations)
User.hasMany(Reservation, { foreignKey: 'user_id' })
Reservation.belongsTo(User, { foreignKey: 'user_id' })

// Salle ↔ Reservation (1 salle → N réservations)
Salle.hasMany(Reservation, { foreignKey: 'salle_id' })
Reservation.belongsTo(Salle, { foreignKey: 'salle_id' })

// Reservation ↔ Paiement (1 reservation → N paiements)
Reservation.hasMany(Paiement, { foreignKey: 'reservation_id' })
Paiement.belongsTo(Reservation, { foreignKey: 'reservation_id' })

// Salle ↔ Disponibilite (1 salle → N disponibilités)
Salle.hasMany(Disponibilite, { foreignKey: 'salle_id' })
Disponibilite.belongsTo(Salle, { foreignKey: 'salle_id' })

// Salle ↔ Avis (1 salle → N avis)
Salle.hasMany(Avis, { foreignKey: 'salle_id' })
Avis.belongsTo(Salle, { foreignKey: 'salle_id' })

// User ↔ Avis (1 client → N avis)
User.hasMany(Avis, { foreignKey: 'user_id' })
Avis.belongsTo(User, { foreignKey: 'user_id' })

// Salle ↔ Equipement (Many-to-Many via SalleEquipement)
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

// Salle ↔ SalleImage (1 salle → N images)
Salle.hasMany(SalleImage, { foreignKey: 'salle_id' })
SalleImage.belongsTo(Salle, { foreignKey: 'salle_id' })

// User ↔ Notification (1 user → N notifications)
User.hasMany(Notification, { foreignKey: 'user_id' })
Notification.belongsTo(User, { foreignKey: 'user_id' })

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
  Notification
}
