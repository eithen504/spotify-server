import { Request, Response } from "express"
import { v2 as cloudinary } from 'cloudinary'
import Track from "../models/track.model";
import Like from "../models/like.model";

export const getTrack = async (req: Request, res: Response) => {
    const id = req.params.id;
    const currentUser = (req as any).user;

    try {
        const track = await Track.findById(id).populate("albumId") as any
        if (!track) {
            res.status(404).json({ message: "Track not found" });
            return;
        }

        const likeDoc = await Like.findOne({ userId: currentUser?._id, trackId: track._id });
        const hasLiked = !!likeDoc; // converts the document to boolean: true if found, false otherwise

        console.log("track", track);

        res.status(200).json({
            id: track._id,
            title: track.title,
            coverImageUrl: track.coverImageUrl,
            audioUrl: track.audioUrl,
            artist: track.artist,
            duration: track.duration,
            genre: track.genre,
            albumId: track.albumId?._id,
            albumName: track.albumId?.title,
            hasLiked,
            createdAt: track.createdAt,
            updatedAt: track.updatedAt,
        })

    } catch (error) {
        console.error("Error in uploadTrack:", error)
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getLikedTracks = async (req: Request, res: Response) => {
    const currentUser = (req as any).user;

    try {
        const likes = await Like.find({ userId: currentUser?._id })
            .populate({
                path: 'trackId',
                populate: {
                    path: 'albumId',
                    select: 'title' // Only select the name field from the album
                }
            }) as any;

        // Extract track data into an array
        const likedTracks = likes.map((like: any) => ({
            id: like.trackId?._id,
            title: like.trackId?.title,
            coverImageUrl: like.trackId?.coverImageUrl,
            audioUrl: like.trackId?.audioUrl,
            artist: like.trackId?.artist,
            duration: like.trackId?.duration,
            genre: like.trackId?.genre,
            albumId: like.trackId?.albumId?._id,
            albumName: like.trackId?.albumId?.title || '', // Get album name or empty string if no album
            hasLiked: true,
            createdAt: like.createdAt,
            updatedAt: like.updatedAt,
        }));

        console.log("liked", likedTracks);

        res.status(200).json(likedTracks);

    } catch (error) {
        console.error("Error in uploadTrack:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const uploadTrack = async (req: Request, res: Response) => {
    const { payload: { title, coverImageUrl, audioUrl, artist, duration, genre, albumId } } = req.body;

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
            genre,
            albumId
        })

        console.log("track", track);

        res.status(200).json(track);

    } catch (error) {
        console.error("Error in uploadTrack:", error)
        res.status(500).json({ error: "Internal server error" });
    }
}


export const likeTrack = async (req: Request, res: Response) => {
    const { trackId } = req.body;
    const currentUser = (req as any).user;

    try {
        // Attempt to delete an existing like
        const deleteResult = await Like.deleteOne({
            userId: currentUser._id,
            trackId
        });

        if (deleteResult.deletedCount > 0) {
            // If a document was deleted, it's an unlike
            res.status(200).json({ isLiked: false });
            return;
        }

        // If no document was deleted, create a new like
        await Like.create({
            userId: currentUser._id,
            trackId
        });

        res.status(200).json({ isLiked: true });

    } catch (error) {
        console.error("Error in likeTrack:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

