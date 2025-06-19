import { Router } from "express";
import transaction from './transaction.js';
import KYC_API from './KYC.js'

const router = Router();

router.use('/transactions', transaction);
router.use('/kyc', KYC_API)

export default router;