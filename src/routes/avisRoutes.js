const express = require('express')
const router = express.Router()
const avisController = require('../controllers/avisController')


router.post('/', avisController.createAvis)
router.get('/salle/:salle_id', avisController.getSalleAvis)
router.delete('/:id', avisController.deleteAvis)

module.exports = router
