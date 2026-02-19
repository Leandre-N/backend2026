const Salle = require('../models/salle')
const Reservation = require('../models/reservation')
const Equipement = require('../models/equipement')
const SalleEquipement = require('../models/salleEquipement')
const { Op } = require('sequelize')


const createSalle = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    
    const { nom, description, adresse, prix_jour, capacite } = req.body
    if (!nom || !adresse || !prix_jour || !capacite) return res.status(400).json({ message: 'Tous les champs sont obligatoires.' })

    const salle = await Salle.create({
      nom,
      description,
      ville,
      adresse,
      prix,
      capacite,
      proprietaire_id: req.user.id
    })
    res.status(201).json({ message: 'Salle créée avec succès', salle })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getAllSalles = async (req, res) => {
  try {
    const salles = await Salle.findAll({ include: [{ model: Equipement, through: SalleEquipement }] })
    res.json(salles)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getSalleById = async (req, res) => {
  try {
    const salle = await Salle.findByPk(req.params.id, { include: [{ model: Equipement, through: SalleEquipement }] })
    if (!salle) return res.status(404).json({ message: 'Salle non trouvée' })
    res.json(salle)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateSalle = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    
    const salle = await Salle.findByPk(req.params.id)
    if (!salle) return res.status(404).json({ message: 'Salle non trouvée' })
    if (salle.proprietaire_id !== req.user.id) return res.status(403).json({ message: 'Impossible de modifier une salle qui n\'est pas à vous' })

    const { nom, description, adresse, prix_jour, capacite } = req.body
    await salle.update({ nom, description, adresse, prix_jour, capacite })
    res.json({ message: 'Salle mise à jour avec succès', salle })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteSalle = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    
    const salle = await Salle.findByPk(req.params.id)
    if (!salle) return res.status(404).json({ message: 'Salle non trouvée' })
    if (salle.proprietaire_id !== req.user.id) return res.status(403).json({ message: 'Impossible de supprimer une salle qui n\'est pas à vous' })

    await salle.destroy()
    res.json({ message: 'Salle supprimée avec succès' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const searchSalles = async (req, res) => {
  try {
    const { lieu, capacite, prix_min, prix_max } = req.query
    const salles = await Salle.findAll({
      where: {
        ...(lieu && { adresse: lieu }),
        ...(capacite && { capacite: { [Op.gte]: capacite } }),
        ...(prix_min && { prix_jour: { [Op.gte]: prix_min } }),
        ...(prix_max && { prix_jour: { [Op.lte]: prix_max } })
      },
      include: [{ model: Equipement, through: SalleEquipement }]
    })
    res.json(salles)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createSalle,
  getAllSalles,
  getSalleById,
  updateSalle,
  deleteSalle,
  searchSalles
}
