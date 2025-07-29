import express from 'express'
import { getMyLibrary, getUserProfile, updateUser } from '../controllers/user.controller';
import { checkAuth } from '../controllers/auth.controller';
import { protectRoute } from '../middlewares/auth.middleware';

const router = express.Router()

router.get("/getUserProfile/:id", getUserProfile);
router.put("/updateUser/:id", protectRoute, updateUser);
router.get("/getMyLibrary",protectRoute, getMyLibrary)

export default router