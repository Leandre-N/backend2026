const express = require('express');
const router = express.Router();
const familyMemberController = require('../controllers/familyMemberController');

router.post('/', familyMemberController.createFamilyMember);      
router.get('/', familyMemberController.getAllFamilyMembers);       
router.get('/:id', familyMemberController.getFamilyMemberById);     
router.put('/:id', familyMemberController.updateFamilyMember);     
router.delete('/:id', familyMemberController.deleteFamilyMember); 

module.exports = router;
