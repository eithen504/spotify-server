import express from 'express'
import { checkAuth, logoutUser, verifyGoogleToken } from '../controllers/auth.controller';
import { protectRoute } from '../middlewares/auth.middleware';

const router = express.Router()

router.post("/verify-google-token", verifyGoogleToken);
router.post("/logout-user", logoutUser);
router.get("/checkAuth", protectRoute, checkAuth);

export default router