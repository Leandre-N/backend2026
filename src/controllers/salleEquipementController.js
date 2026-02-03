const Salle = require('../models/salle')
const Equipement = require('../models/equipement')
const SalleEquipement = require('../models/salleEquipement')

const createSalleEquipement = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') {
      return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    }

    const { salle_id, equipement_id } = req.body
    if (!salle_id || !equipement_id) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' })
    }

    const salle = await Salle.findByPk(salle_id)
    if (!salle || salle.proprietaire_id !== req.user.id) {
      return res.status(403).json({ message: 'Salle non autorisée' })
    }

    const equipement = await Equipement.findByPk(equipement_id)
    if (!equipement) {
      return res.status(404).json({ message: 'Équipement non trouvé' })
    }

    const liaison = await SalleEquipement.create({
      salle_id,
      equipement_id
    })

    res.status(201).json({
      message: 'Équipement associé à la salle',
      liaison
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getSalleEquipements = async (req, res) => {
  try {
    const equipements = await SalleEquipement.findAll({
      where: { salle_id: req.params.salle_id },
      include: [Equipement]
    })

    res.json(equipements)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


const deleteSalleEquipement = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') {
      return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    }

    const liaison = await SalleEquipement.findByPk(req.params.id)
    if (!liaison) {
      return res.status(404).json({ message: 'Liaison non trouvée' })
    }

    const salle = await Salle.findByPk(liaison.salle_id)
    if (salle.proprietaire_id !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    await liaison.destroy()
    res.json({ message: 'Équipement retiré de la salle' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createSalleEquipement,
  getSalleEquipements,
  deleteSalleEquipement
}
