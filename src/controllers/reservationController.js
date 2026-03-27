const Reservation = require('../models/reservation')
const Salle = require('../models/salle')
const User = require('../models/user')


const createReservation = async (req, res) => {
  console.log('--- Nouvelle tentative de réservation ---');
  console.log('Utilisateur:', req.user);
  console.log('Corps de la requête:', req.body);
  try {
    if (req.user.role !== 'CLIENT') return res.status(403).json({ message: 'Accès réservé aux clients' })

    const { salle_id, date, creneau, montant_total, num_tel, mode_paiement } = req.body
    if (!salle_id || !date || !creneau || !montant_total) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' })
    }

    const salle = await Salle.findByPk(salle_id)
    if (!salle) return res.status(404).json({ message: 'Salle non trouvée' })

    const reservation = await Reservation.create({
      salle_id,
      user_id: req.user.id,
      date,
      creneau,
      montant_total,
      num_tel,
      mode_paiement,
      statut: 'EN_ATTENTE'
    })
    res.status(201).json({ message: 'Réservation créée avec succès', reservation })
  } catch (error) {
    console.error('Erreur createReservation:', error);
    res.status(500).json({ error: error.message })
  }
}

const getMyReservations = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT') return res.status(403).json({ message: 'Accès réservé aux clients' })
    const reservations = await Reservation.findAll({ where: { user_id: req.user.id }, include: [Salle] })
    res.json(reservations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getProprietaireReservations = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    const reservations = await Reservation.findAll({
      include: [
        {
          model: Salle,
          where: { proprietaire_id: req.user.id }
        },
        {
          model: User,
          attributes: ['id', 'nom', 'telephone']
        }
      ]
    })
    res.json(reservations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateReservationStatus = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') return res.status(403).json({ message: 'Accès réservé aux propriétaires' })

    const reservation = await Reservation.findByPk(req.params.id, { include: [Salle] })
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' })
    
    // Correction de l'accès à la salle (vérifier les deux cas)
    const salle = reservation.Salle || reservation.salle;
    if (!salle) return res.status(500).json({ message: 'Erreur: Salle non liée à la réservation' });

    if (salle.proprietaire_id !== req.user.id) return res.status(403).json({ message: 'Impossible de modifier cette réservation' })

    const { statut } = req.body
    if (!['EN_ATTENTE', 'CONFIRMEE', 'ANNULEE', 'TERMINEE'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' })
    }

    await reservation.update({ statut })
    res.json({ message: 'Statut mis à jour avec succès', reservation })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteReservation = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT') return res.status(403).json({ message: 'Accès réservé aux clients' })
    const reservation = await Reservation.findByPk(req.params.id)
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' })
    if (reservation.user_id !== req.user.id) return res.status(403).json({ message: 'Impossible de supprimer cette réservation' })

    await reservation.destroy()
    res.json({ message: 'Réservation supprimée avec succès' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getBlockedDates = async (req, res) => {
  try {
    const { salle_id } = req.params
    const reservations = await Reservation.findAll({
      where: {
        salle_id,
        statut: 'CONFIRMEE'
      },
      attributes: ['date']
    })
    const dates = reservations.map(r => r.date)
    res.json(dates)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createReservation,
  getMyReservations,
  getProprietaireReservations,
  updateReservationStatus,
  deleteReservation,
  getBlockedDates
}
