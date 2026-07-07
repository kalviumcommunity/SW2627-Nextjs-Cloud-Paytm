const getRechargeHistory = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Recharge history fetched successfully",
    data: [],
  });
};

module.exports = {
  getRechargeHistory,
};