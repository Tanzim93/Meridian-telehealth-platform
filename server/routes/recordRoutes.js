const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { authRequired } = require('../middleware/authMiddleware');

router.get('/', authRequired, recordController.get);
router.post('/:field', authRequired, recordController.addItem);
router.delete('/:field/:index', authRequired, recordController.removeItem);

module.exports = router;
