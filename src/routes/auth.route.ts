import express from 'express'
import { checkAuth, logoutUser, verifyGoogleToken } from '../controllers/auth.controller';
import { protectRoute } from '../middlewares/auth.middleware';

const router = express.Router()

router.get("/checkAuth", protectRoute, checkAuth);
router.post("/verify-google-token", verifyGoogleToken);
router.post("/logout-user", logoutUser);

export default router