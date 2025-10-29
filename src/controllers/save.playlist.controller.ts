import { Request, Response } from "express"
import SavePlaylist from "../models/save.playlist.model";

const savePlaylist = async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = (req as any).user;

    if (!currentUser) {
        res.status(401).json({ errorMessage: "Authentication required. Please log in or create an account to save this playlist." });
        return;
    }

    try {
        // Attempt to delete an existing save Document
        const deleteResult = await SavePlaylist.deleteOne({
            userId: currentUser._id,
            playlistId: id
        });

        if (deleteResult.deletedCount > 0) {
            // If a document was deleted, it's an unSave
            res.status(200).json({ isSave: false });
            return;
        }

        // If no document was deleted, create a new save
        await SavePlaylist.create({
            userId: currentUser._id,
            playlistId: id
        });

        res.status(200).json({ isSaved: true });

    } catch (error) {
        console.error("Error in savePlaylist:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
};

const getCurrentUserSavePlaylists = async (req: Request, res: Response) => {
    const currentUser = (req as any).user;

    try {
        const playlists = await SavePlaylist.find({ userId: currentUser._id })
            .populate("playlistId")
            .limit(24) as any

        const resultPlaylists = playlists.map((p: any) => ({
            _id: p.playlistId?._id,
            title: p.playlistId?.title,
            coverImageUrl: p.playlistId?.coverImageUrl,
            userId: p.userId,
            genre: p.playlistId?.genre,
            tracks: p.playlistId?.tracks,
            createdAt: p.playlistId?.createdAt,
            updatedAt: p.playlistId?.updatedAt,
        }));


        res.status(200).json(resultPlaylists);
    } catch (error) {
        console.error("Error in getCurrentUserPlaylists:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export {
    savePlaylist,
    getCurrentUserSavePlaylists
}