const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { auth, authorize } = require('../middlewares/auth')  // ✅ corrige l'import


router.post('/', userController.createUser)
router.post('/login', userController.loginUser)
router.put(
  '/:id',
  auth,
  authorize(['CLIENT', 'PROPRIETAIRE']),  // ✅ on appelle la fonction avec les rôles
  userController.updateUser                // ✅ utiliser la fonction du controller
)

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.delete('/:id', userController.deleteUser)

module.exports = router