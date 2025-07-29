import { model, Schema } from "mongoose";

const albumSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        coverImageUrl: {
            type: String,
        }
    },
    { timestamps: true }
);

const Album = model('Album', albumSchema);
export default Album
