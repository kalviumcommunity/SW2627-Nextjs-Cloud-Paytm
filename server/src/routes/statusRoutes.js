const express = require('express');
const router = express.Router();

const statusController = require("../controllers/statusController");

router.get("/:transactionId", statusController.getTransactionStatus);

module.exports = router;