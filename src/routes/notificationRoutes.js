const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notificationController')
const { auth } = require('../middlewares/auth')

router.use(auth)

router.get('/me', notificationController.getMyNotifications)
router.put('/mark-as-read', notificationController.markAsRead)

module.exports = router
