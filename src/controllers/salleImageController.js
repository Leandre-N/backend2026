const SalleImage = require('../models/salleImage')
const Salle = require('../models/salle')


const addSalleImage = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') {
      return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    }

    const { salle_id, url } = req.body
    if (!salle_id || !url) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' })
    }

    const salle = await Salle.findByPk(salle_id)
    if (!salle || salle.proprietaire_id !== req.user.id) {
      return res.status(403).json({ message: 'Salle non autorisée' })
    }

    const image = await SalleImage.create({
      salle_id,
      url
    })

    res.status(201).json({ message: 'Image ajoutée à la salle', image })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getSalleImages = async (req, res) => {
  try {
    const images = await SalleImage.findAll({
      where: { salle_id: req.params.salle_id }
    })

    res.json(images)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteSalleImage = async (req, res) => {
  try {
    if (req.user.role !== 'PROPRIETAIRE') {
      return res.status(403).json({ message: 'Accès réservé aux propriétaires' })
    }

    const image = await SalleImage.findByPk(req.params.id)
    if (!image) return res.status(404).json({ message: 'Image non trouvée' })

    const salle = await Salle.findByPk(image.salle_id)
    if (salle.proprietaire_id !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    await image.destroy()
    res.json({ message: 'Image supprimée avec succès' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  addSalleImage,
  getSalleImages,
  deleteSalleImage
}
