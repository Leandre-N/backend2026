const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notificationController')


router.post('/', notificationController.createNotification)
router.get('/user/:user_id', notificationController.getMyNotifications)
router.put('/:id/lu', notificationController.markAsRead)
router.delete('/:id', notificationController.deleteNotification)

module.exports = router
