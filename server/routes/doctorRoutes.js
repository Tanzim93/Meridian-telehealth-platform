const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/', doctorController.list);
router.get('/:id', doctorController.getOne);

module.exports = router;
