const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');

router.get('/', familyController.getAllFamilies);
router.get('/:id', familyController.getFamilyById);
router.post('/', familyController.createFamily);
router.put('/:id', familyController.updateFamily);
router.delete('/:id', familyController.deleteFamily);

module.exports = router;
