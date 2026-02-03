const express = require('express')
const router = express.Router()
const salleEquipementController = require('../controllers/salleEquipementController')


router.post('/', salleEquipementController.createSalleEquipement)
router.get('/salle/:salle_id', salleEquipementController.getSalleEquipements)
router.delete('/:id', salleEquipementController.deleteSalleEquipement)

module.exports = router
