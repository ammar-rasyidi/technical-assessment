import { Router } from "express";

import { KYC_API } from "../controllers/index.js"

const router = Router();

router.get('/status', (req, res) => {
    res.send('KYC status');
});
router.post('/verify', KYC_API.verify)
router.post('/check', KYC_API.check)

export default router;