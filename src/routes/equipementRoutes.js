const express = require('express')
const router = express.Router()
const equipementController = require('../controllers/equipementController')


router.post('/', equipementController.createEquipement)
router.get('/', equipementController.getAllEquipements)
router.post('/salle', equipementController.addEquipementToSalle)
router.delete('/:id', equipementController.deleteEquipement)

module.exports = router
