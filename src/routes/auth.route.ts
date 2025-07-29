import express from 'express'
import { checkAuth, verifyGoogleToken } from '../controllers/auth.controller';
import { protectRoute } from '../middlewares/auth.middleware';

const router = express.Router()

router.post("/verify-google-token", verifyGoogleToken);
router.get("/checkAuth", protectRoute, checkAuth);

export default router