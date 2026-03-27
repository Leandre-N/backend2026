const express = require('express')
const router = express.Router()
const reservationController = require('../controllers/reservationController')
const { auth } = require('../middlewares/auth')

// Toutes les routes de réservation nécessitent d'être connecté
router.use(auth)

router.post('/', reservationController.createReservation)
router.get('/me', reservationController.getMyReservations) 
router.get('/proprietaire', reservationController.getProprietaireReservations)
router.get('/blocked-dates/:salle_id', reservationController.getBlockedDates)
router.put('/:id', reservationController.updateReservationStatus)
router.delete('/:id', reservationController.deleteReservation)

module.exports = router
