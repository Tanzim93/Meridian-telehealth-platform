const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authRequired } = require('../middleware/authMiddleware');

router.get('/', authRequired, messageController.list);
router.post('/:doctorId', authRequired, messageController.send);

module.exports = router;
