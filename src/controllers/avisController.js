const Avis = require('../models/avis')
const Reservation = require('../models/reservation')
const Salle = require('../models/salle')


const createAvis = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({ message: 'Accès réservé aux clients' })
    }

    const { reservation_id, note, commentaire } = req.body
    if (!reservation_id || !note) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' })
    }

    const reservation = await Reservation.findByPk(reservation_id)
    if (!reservation || reservation.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Réservation non autorisée' })
    }

    const avis = await Avis.create({
      reservation_id,
      salle_id: reservation.salle_id,
      user_id: req.user.id,
      note,
      commentaire
    })

    res.status(201).json({ message: 'Avis ajouté avec succès', avis })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getSalleAvis = async (req, res) => {
  try {
    const avis = await Avis.findAll({
      where: { salle_id: req.params.salle_id }
    })
    res.json(avis)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


const deleteAvis = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({ message: 'Accès refusé' })
    }

    const avis = await Avis.findByPk(req.params.id)
    if (!avis) {
      return res.status(404).json({ message: 'Avis non trouvé' })
    }

    if (avis.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    await avis.destroy()
    res.json({ message: 'Avis supprimé avec succès' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createAvis,
  getSalleAvis,
  deleteAvis
}
