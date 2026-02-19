const Disponibilite = require('../models/disponibilite')
const Salle = require('../models/salle')


const createDisponibilite = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') {
      return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    }

    const { salle_id, date_debut, date_fin } = req.body
    if (!salle_id || !date_debut || !date_fin) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' })
    }

    const salle = await Salle.findByPk(salle_id)
    if (!salle || salle.proprietaire_id !== req.user.id) {
      return res.status(403).json({ message: 'Salle non autorisée' })
    }

    const dispo = await Disponibilite.create({
      salle_id,
      date,
      creneau
    })

    res.status(201).json({ message: 'Indisponibilité ajoutée', dispo })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


const getSalleDisponibilites = async (req, res) => {
  try {
    const disponibilites = await Disponibilite.findAll({
      where: { salle_id: req.params.salle_id }
    })
    res.json(disponibilites)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteDisponibilite = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') {
      return res.status(403).json({ message: 'Accès refusé' })
    }

    const dispo = await Disponibilite.findByPk(req.params.id)
    if (!dispo) {
      return res.status(404).json({ message: 'Indisponibilité non trouvée' })
    }

    const salle = await Salle.findByPk(dispo.salle_id)
    if (salle.proprietaire_id !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    await dispo.destroy()
    res.json({ message: 'Indisponibilité supprimée' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createDisponibilite,
  getSalleDisponibilites,
  deleteDisponibilite
}
