import { model, Schema } from "mongoose";

const saveAlbumSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        albumId: {
            type: Schema.Types.ObjectId,
            ref: "Album",
        } 
    },
    { timestamps: true }
);

const SaveAlbum = model('SaveAlbum', saveAlbumSchema);
export default SaveAlbum
