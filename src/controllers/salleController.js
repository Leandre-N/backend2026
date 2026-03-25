const Salle = require('../models/salle')
const Reservation = require('../models/reservation')
const Equipement = require('../models/equipement')
const SalleEquipement = require('../models/salleEquipement')
const { Op } = require('sequelize')


const createSalle = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE')
      return res.status(403).json({ message: 'Accès réservé aux propriétaires' })

    const { nom, description, ville, adresse, prix, capacite, equipements } = req.body

    if (!nom || !ville || !prix || !capacite)
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' })

    const salle = await Salle.create({
      nom,
      description,
      ville,
      adresse,
      prix: parseFloat(prix),
      capacite: parseInt(capacite),
      proprietaire_id: req.user.id,
      image: req.file ? `uploads/salles/${req.file.filename}` : null
    })

    // ✅ Créer et lier les équipements si fournis
    if (equipements) {
      const liste = JSON.parse(equipements) // tableau JSON envoyé depuis Flutter
      for (const nomEquip of liste) {
        // Créer l'équipement s'il n'existe pas
        const [equipement] = await Equipement.findOrCreate({
          where: { nom: nomEquip }
        })
        // Lier à la salle
        await SalleEquipement.create({
          salle_id: salle.id,
          equipement_id: equipement.id
        })
      }
    }

    // ✅ Retourner la salle avec ses équipements
    const salleComplete = await Salle.findByPk(salle.id, {
      include: [{ model: Equipement, through: SalleEquipement }]
    })

    res.status(201).json({ message: 'Salle créée avec succès', salle: salleComplete })

  } catch (error) {
    console.error('❌ Erreur createSalle :', error.message)
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

const User = require('../models/user')

const getSalleById = async (req, res) => {
  try {
    const salle = await Salle.findByPk(req.params.id, {
      include: [
        { model: Equipement, through: SalleEquipement },
        {
          model: User,
          as: 'user',
          attributes: ['nom', 'telephone'], // ✅ nom + tel du proprio
        }
      ]
    })
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

    const { nom, description, adresse, prix, capacite, ville, equipements } = req.body
    
    // Si une nouvelle image est envoyée, on remplace l'ancienne
    let imageUrl = salle.image
    if (req.file) {
      imageUrl = `uploads/salles/${req.file.filename}`
    }

    await salle.update({ 
      nom, 
      description, 
      adresse, 
      ville,
      prix: prix ? parseFloat(prix) : salle.prix, 
      capacite: capacite ? parseInt(capacite) : salle.capacite,
      image: imageUrl
    })

    // ✅ Mettre à jour les équipements si fournis
    if (equipements) {
      const liste = JSON.parse(equipements)
      // Supprimer les anciennes associations
      await SalleEquipement.destroy({ where: { salle_id: salle.id } })
      
      for (const nomEquip of liste) {
        const [equipement] = await Equipement.findOrCreate({
          where: { nom: nomEquip }
        })
        await SalleEquipement.create({
          salle_id: salle.id,
          equipement_id: equipement.id
        })
      }
    }

    const salleMiseAJour = await Salle.findByPk(salle.id, {
      include: [{ model: Equipement, through: SalleEquipement }]
    })

    res.json({ message: 'Salle mise à jour avec succès', salle: salleMiseAJour })
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
