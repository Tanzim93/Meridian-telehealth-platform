const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authRequired } = require('../middleware/authMiddleware');

router.put('/', authRequired, profileController.update);

module.exports = router;
