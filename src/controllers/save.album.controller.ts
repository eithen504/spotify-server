import { Request, Response } from "express"
import SaveAlbum from "../models/save.album.model";

const saveAlbum = async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = (req as any).user;

    if (!currentUser) {
        res.status(401).json({ errorMessage: "Authentication required. Please log in or create an account to save this album." });
        return;
    }

    try {
        // Attempt to delete an existing save Document
        const deleteResult = await SaveAlbum.deleteOne({
            userId: currentUser._id,
            albumId: id
        });

        if (deleteResult.deletedCount > 0) {
            // If a document was deleted, it's an unSave
            res.status(200).json({ isSave: false });
            return;
        }

        // If no document was deleted, create a new save
        await SaveAlbum.create({
            userId: currentUser._id,
            albumId: id
        });

        res.status(200).json({ isSaved: true });

    } catch (error) {
        console.error("Error in saveAlbum:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
};

const getCurrentUserSaveAlbums = async (req: Request, res: Response) => {
    const currentUser = (req as any).user;

    try {
        const albums = await SaveAlbum.find({ userId: currentUser._id })
            .populate("albumId")
            .limit(24) as any

        const resultAlbums = albums.map((a: any) => ({
            _id: a.albumId?._id,
            title: a.albumId?.title,
            coverImageUrl: a.albumId?.coverImageUrl,
            createdAt: a.albumId?.createdAt,
            updatedAt: a.albumId?.updatedAt,
        }));


        res.status(200).json(resultAlbums);
    } catch (error) {
        console.error("Error in getCurrentUserSaveAlbums:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export {
    saveAlbum,
    getCurrentUserSaveAlbums
}