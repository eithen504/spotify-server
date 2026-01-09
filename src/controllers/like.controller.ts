import { Request, Response } from "express"
import Like from "../models/like.model";

const likeTrack = async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = (req as any).user;

    if (!currentUser) {
        res.status(401).json({ errorMessage: "Authentication required. Please log in or create an account to like this track." });
        return;
    }

    try {
        // Attempt to delete an existing like
        const deleteResult = await Like.deleteOne({
            userId: currentUser._id,
            trackId: id
        });

        if (deleteResult.deletedCount > 0) {
            // If a document was deleted, it's an unlike
            res.status(200).json({ isLiked: false });
            return;
        }

        // If no document was deleted, create a new like
        await Like.create({
            userId: currentUser._id,
            trackId: id
        });

        res.status(200).json({ isLiked: true });

    } catch (error) {
        console.error("Error in likeTrack:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
};

const getLikedTracks = async (req: Request, res: Response) => {
    const currentUser = (req as any).user;

    try {
        const likes = await Like.find({ userId: currentUser?._id })
            .populate({
                path: 'trackId',
                populate: {
                    path: "albumId",
                }
            }) as any;

        // Extract track data into an array
        const likedTracks = likes.map((like: any) => ({
            _id: like.trackId?._id,
            title: like.trackId?.title,
            coverImageUrl: like.trackId?.coverImageUrl,
            audioUrl: like.trackId?.audioUrl,
            artist: like.trackId?.artist,
            duration: like.trackId?.duration,
            genres: like.trackId?.genres,
            albumId: like.trackId?.albumId?._id,
            albumName: like.trackId?.albumId?.title || 'album name', // Get album name or empty string if no album
            language: like.trackId?.language,
            hasLiked: true,
            createdAt: like.createdAt,
            updatedAt: like.updatedAt,
        }));

        res.status(200).json(likedTracks);

    } catch (error) {
        console.error("Error in getLikedTracks:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
}

export {
    likeTrack,
    getLikedTracks
}