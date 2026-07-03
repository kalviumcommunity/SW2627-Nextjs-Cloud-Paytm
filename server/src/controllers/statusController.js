import * as rechargeService from '../services/rechargeService.js';

export const getTransactionStatus = async (req, res, next) => {
    try{
        const { transactionId } = req.params;

        const transaction = await rechargeService.getTransactionStatus(transactionId);
        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        next(error);
    }
};