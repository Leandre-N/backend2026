const express = require('express')
const router = express.Router()
const reservationController = require('../controllers/reservationController')


router.post('/', reservationController.createReservation)
router.get('/mes-reservations', reservationController.getMyReservations)
router.get('/proprietaire', reservationController.getProprietaireReservations)
router.put('/:id/statut', reservationController.updateReservationStatus)
router.delete('/:id', reservationController.deleteReservation)

module.exports = router
