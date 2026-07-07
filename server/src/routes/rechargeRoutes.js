const express = require('express');
const router = express.Router();

const rechargeController = require("../controllers/rechargeController");

router.post('/recharge', rechargeController.createRecharge);

module.exports = router;