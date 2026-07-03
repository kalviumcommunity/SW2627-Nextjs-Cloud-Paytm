import * as rechargeService from '../services/rechargeService.js';

export const createRecharge = async (req, res, next) => {
    try {
        const recharge = await rechargeService.createRecharge(req.body);
        res.status(201).json({
            success: true,
            message: "Recharge initiated successfully",
            data: recharge,
        });
    } catch (error) {
        next(error);
    }
};