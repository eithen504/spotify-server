import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware';
import { saveAlbum, getCurrentUserSaveAlbums } from '../controllers/save.album.controller';

const router = express.Router()

// Custom route

// Standard CRUD operations for albums
router.post("/:id", protectRoute, saveAlbum);
router.get("/", protectRoute, getCurrentUserSaveAlbums);

export default router  