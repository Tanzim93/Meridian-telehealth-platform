const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authRequired } = require('../middleware/authMiddleware');

router.get('/', authRequired, appointmentController.list);
router.post('/', authRequired, appointmentController.create);
router.delete('/:id', authRequired, appointmentController.remove);

module.exports = router;
