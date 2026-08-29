const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authRequired } = require('../middleware/authMiddleware');

router.get('/', authRequired, invoiceController.list);
router.post('/:id/pay', authRequired, invoiceController.pay);

module.exports = router;
