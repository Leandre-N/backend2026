const Paiement = require('../models/paiement')
const Reservation = require('../models/reservation')
const Salle = require('../models/salle')

const createPayment = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({ message: 'Accès réservé aux clients' })
    }

    const { reservation_id, montant, mode } = req.body
    if (!reservation_id || !montant || !mode) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' })
    }

    const reservation = await Reservation.findByPk(reservation_id)
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' })
    }

    if (reservation.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    const paiement = await Paiement.create({
      reservation_id,
      montant,
      mode,
      statut: 'SUCCES'
    })

    await reservation.update({ statut: 'PAYEE' })

    res.status(201).json({
      message: 'Paiement effectué avec succès',
      paiement
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


const getMyPayments = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({ message: 'Accès réservé aux clients' })
    }

    const paiements = await Paiement.findAll({
      include: [{
        model: Reservation,
        where: { user_id: req.user.id }
      }]
    })

    res.json(paiements)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getProprietairePayments = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') {
      return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    }

    const paiements = await Paiement.findAll({
      include: [{
        model: Reservation,
        include: [{
          model: Salle,
          where: { proprietaire_id: req.user.id }
        }]
      }]
    })

    res.json(paiements)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getPaymentById = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id)
    if (!paiement) {
      return res.status(404).json({ message: 'Paiement non trouvé' })
    }
    res.json(paiement)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createPayment,
  getMyPayments,
  getProprietairePayments,
  getPaymentById
}
