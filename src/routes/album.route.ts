import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware';
import { getAlbumTracks, getMySavedAlbums, saveAlbum, uploadAlbum } from '../controllers/album.controller';

const router = express.Router()

router.post("/uploadAlbum", protectRoute, uploadAlbum);
router.get("/getAlbumTracks/:id", protectRoute, getAlbumTracks);
router.post("/saveAlbum", protectRoute, saveAlbum)
router.get("/getMySavedAlbums", protectRoute, getMySavedAlbums);



export default router