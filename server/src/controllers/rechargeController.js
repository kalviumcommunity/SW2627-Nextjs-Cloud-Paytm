const createRecharge = (req, res) => {
  res.status(201).json({
    success: true,
    message: "Recharge request received",
  });
};

module.exports = {
  createRecharge,
};