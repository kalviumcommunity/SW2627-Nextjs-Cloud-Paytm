const getTransactionStatus = (req, res) => {
  const { transactionId } = req.params;

  res.status(200).json({
    success: true,
    message: "Transaction status fetched successfully",
    transactionId,
    status: "PENDING",
  });
};

module.exports = {
  getTransactionStatus,
};