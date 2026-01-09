import Track from "../models/track.model";
import { Request, Response } from "express"
import { v2 as cloudinary } from 'cloudinary'
import Like from "../models/like.model";

const getSuggestedTracks = async (req: Request, res: Response) => {
    const currentUser = (req as any).user;
    const { id: excludeId } = req.params;

    try {
        // Fetch 5 random tracks
        const tracks = await Track.find({ _id: { $ne: excludeId } }).limit(5);

        // For each track, check if the current user liked it
        const response = await Promise.all(
            tracks.map(async (track: any) => {
                const likeDoc = await Like.findOne({
                    userId: currentUser?._id,
                    trackId: track._id
                });

                return {
                    _id: track._id,
                    title: track.title,
                    coverImageUrl: track.coverImageUrl,
                    audioUrl: track.audioUrl,
                    artist: track.artist,
                    duration: track.duration,
                    albumId: track.albumId,
                    albumName: "",
                    languages: track.languages,
                    hasLiked: !!likeDoc,
                    createdAt: track.createdAt,
                    updatedAt: track.updatedAt,
                };
            })
        );

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getSuggestedTracks:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
};

const uploadTrack = async (req: Request, res: Response) => {
    const {
        payload: {
            title,
            coverImageUrl,
            audioUrl,
            artist,
            duration,
            albumId,
            languages
        }
    } = req.body;

    try {
        const uploadAudioResult = await cloudinary.uploader.upload(audioUrl, {
            resource_type: "auto",
        });

        // Upload cover image URL to Cloudinary (if provided)
        let uploadImageResult;
        if (coverImageUrl) {
            uploadImageResult = await cloudinary.uploader.upload(coverImageUrl);
        }

        const track = await Track.create({
            title,
            coverImageUrl: uploadImageResult?.secure_url || "",
            audioUrl: uploadAudioResult.secure_url || "",
            artist,
            duration,
            albumId,
            languages
        })

        res.status(200).json(track);

    } catch (error) {
        console.error("Error in uploadTrack:", error)
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

const getTrack = async (req: Request, res: Response) => {
    const id = req.params.id;
    const currentUser = (req as any).user;

    try {
        const track = await Track.findById(id)
        if (!track) {
            res.status(404).json({ errorMessage: "Track not found" });
            return;
        }

        const likeDoc = await Like.findOne({ userId: currentUser?._id, trackId: track._id });
        const hasLiked = !!likeDoc; // converts the document to boolean: true if found, false otherwise

        res.status(200).json({
            _id: track._id,
            title: track.title,
            coverImageUrl: track.coverImageUrl,
            audioUrl: track.audioUrl,
            artist: track.artist,
            duration: track.duration,
            albumId: track.albumId,
            albumName: "",
            languages: track.languages,
            hasLiked,
            createdAt: track.createdAt,
            updatedAt: track.updatedAt,
        })

    } catch (error) {
        console.error("Error in getTrack:", error)
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

const updateTrack = async (req: Request, res: Response) => {
    const { payload: { title, coverImageUrl } } = req.body;
    const { id } = req.params; // assuming track id is passed in route params

    try {
        let uploadImageResult;

        // Upload cover image URL to Cloudinary (if provided)
        if (coverImageUrl) {
            uploadImageResult = await cloudinary.uploader.upload(coverImageUrl);
        }

        // Build update object
        const updateFields: any = {};
        if (title) updateFields.title = title;
        if (uploadImageResult?.secure_url) {
            updateFields.coverImageUrl = uploadImageResult.secure_url;
        }

        // Update track
        const track = await Track.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true } // return updated doc
        );

        if (!track) {
            return res.status(404).json({ errorMessage: "Track not found" });
        }

        res.status(200).json(track);
    } catch (error) {
        console.error("Error in updateTrack:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
};

export {
    getSuggestedTracks,
    uploadTrack,
    getTrack,
    updateTrack
}