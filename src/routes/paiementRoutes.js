const express = require('express')
const router = express.Router()
const paiementController = require('../controllers/paiementController')


router.post('/', paiementController.createPayment)
router.get('/mes-paiements', paiementController.getMyPayments)
router.get('/proprietaire', paiementController.getProprietairePayments)
router.get('/:id', paiementController.getPaymentById)

module.exports = router
