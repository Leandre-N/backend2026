const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { auth, authorize } = require('../middlewares/auth') 


router.post('/', userController.createUser)
router.post('/login', userController.loginUser)

router.get('/dashboard', auth, authorize(['PROPRIETAIRE']), userController.getProprietaireDashboard)

router.put(
  '/:id',
  auth,
  authorize(['CLIENT', 'PROPRIETAIRE']), 
  userController.updateUser 
)

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.delete('/:id', userController.deleteUser)

module.exports = router