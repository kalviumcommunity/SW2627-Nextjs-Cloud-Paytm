import * as rechargeService from '../services/rechargeService.js';

export const getRechargeHistory = async (req, res, next) => {
    try{
        const {operator, startDate, endDate} = req.query;
        const history = await rechargeService.getRechargeHistory({
            operator,
            startDate,
            endDate,
        });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history,
        });
    } catch (error) {
        next(error);
    }
};