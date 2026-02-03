const Equipement = require('../models/equipement')
const Salle = require('../models/salle')
const SalleEquipement = require('../models/salleEquipement')


const createEquipement = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') {
      return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    }

    const { nom } = req.body
    if (!nom) {
      return res.status(400).json({ message: 'Nom requis' })
    }

    const equipement = await Equipement.create({ nom })
    res.status(201).json({ message: 'Équipement créé', equipement })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getAllEquipements = async (req, res) => {
  try {
    const equipements = await Equipement.findAll()
    res.json(equipements)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const addEquipementToSalle = async (req, res) => {
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

    await SalleEquipement.create({ salle_id, equipement_id })
    res.json({ message: 'Équipement ajouté à la salle' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteEquipement = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') {
      return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    }

    const equipement = await Equipement.findByPk(req.params.id)
    if (!equipement) {
      return res.status(404).json({ message: 'Équipement non trouvé' })
    }

    await SalleEquipement.destroy({
      where: { equipement_id: equipement.id }
    })

    await equipement.destroy()

    res.json({ message: 'Équipement supprimé avec succès' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


module.exports = {
  createEquipement,
  getAllEquipements,
  addEquipementToSalle,
  deleteEquipement
}
