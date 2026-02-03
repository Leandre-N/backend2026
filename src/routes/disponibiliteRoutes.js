const express = require('express')
const router = express.Router()
const disponibiliteController = require('../controllers/disponibiliteController')


router.post('/', disponibiliteController.createDisponibilite)
router.get('/salle/:salle_id', disponibiliteController.getSalleDisponibilites)
router.delete('/:id', disponibiliteController.deleteDisponibilite)

module.exports = router
