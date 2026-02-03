const express = require('express')
const router = express.Router()
const salleImageController = require('../controllers/salleImageController')


router.post('/', salleImageController.addSalleImage)
router.get('/salle/:salle_id', salleImageController.getSalleImages)
router.delete('/:id', salleImageController.deleteSalleImage)

module.exports = router
