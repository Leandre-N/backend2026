const express = require('express')
const router = express.Router()
const salleController = require('../controllers/salleController')
const { auth, authorize } = require('../middlewares/auth')
const upload = require('../middlewares/upload') // ← AJOUTER

router.post(
  '/',
  auth,
  authorize(['PROPRIETAIRE']),
  upload.single('image'), // ← AJOUTER
  salleController.createSalle
)

router.delete('/:id', auth, authorize(['PROPRIETAIRE']), salleController.deleteSalle)
router.get('/', salleController.getAllSalles)
router.get('/:id', salleController.getSalleById)
router.put(
  '/:id',
  auth,
  authorize(['PROPRIETAIRE']),
  upload.single('image'),
  salleController.updateSalle
)

module.exports = router