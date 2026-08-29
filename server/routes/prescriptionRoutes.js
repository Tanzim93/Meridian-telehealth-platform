const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authRequired } = require('../middleware/authMiddleware');

router.get('/', authRequired, prescriptionController.list);
router.post('/:id/refill', authRequired, prescriptionController.refill);

module.exports = router;
