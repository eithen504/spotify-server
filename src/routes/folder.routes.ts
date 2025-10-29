import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware';
import {
    getCurrentUserFolders,
    addItemToFolder,
    uploadFolder,
    getFolderPlaylists,
    updateFolder,
    deleteFolder,
} from '../controllers/folder.controller';

const router = express.Router()

router.get("/me", protectRoute, getCurrentUserFolders);
router.patch("/:id/items", protectRoute, addItemToFolder);

// Standard CRUD operations for folder
router.post("/", protectRoute, uploadFolder);
router.get("/:id", protectRoute, getFolderPlaylists);
router.patch("/:id", protectRoute, updateFolder);
router.delete("/:id", protectRoute, deleteFolder);

export default router