const express = require('express')
const router = express.Router()
const salleController = require('../controllers/salleController')
const { auth, authorize } = require('../middlewares/auth')

router.post('/', auth, authorize(['PROPRIETAIRE']), salleController.createSalle)

router.delete('/:id', auth, authorize(['PROPRIETAIRE']), salleController.deleteSalle)

router.get('/', salleController.getAllSalles)
router.get('/:id', salleController.getSalleById)
router.put('/:id', salleController.updateSalle)


module.exports = router
