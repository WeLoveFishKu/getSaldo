const express = require('express');
const router = express.Router();
const handlers = require('./handlers');

router.get('/seller/saldo/:id_Seller', handlers.getSaldo);
module.exports = router;
