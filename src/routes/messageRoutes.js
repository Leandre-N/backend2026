const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth } = require('../middlewares/auth') 


router.post('/', messageController.sendMessage);
router.get('/', messageController.getMessages);
router.get('/inbox', messageController.getInbox);
router.put('/:id', messageController.updateMessage);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;