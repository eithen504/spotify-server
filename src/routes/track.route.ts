import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { 
  getSuggestedTracks, 
  uploadTrack,
  getTrack, 
  updateTrack, 
} from "../controllers/track.controller";

const router = express.Router(); 

// Custom route
router.get("/suggested/:id", protectRoute, getSuggestedTracks); // GET suggested tracks

// Standard CRUD operations for tracks
router.post("/", protectRoute, uploadTrack);        
router.get("/:id", protectRoute, getTrack);        
router.patch("/:id", protectRoute, updateTrack); 


export default router;
 