import { model, Schema } from "mongoose";
import { GENRES } from "../constants";

const trackSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        coverImageUrl: {
            type: String,
        },
        audioUrl: {
            type: String,
            required: true,
        },
        artist: {
            type: String,
        },
        duration: {
            type: String,
        },
        genre: [
            {
                type: String,
                enum: GENRES,
            }
        ],
        albumId: {
            type: Schema.Types.ObjectId,
            ref: "Album",
            default: null,
        },
    },
    { timestamps: true }
);

const Track = model("Track", trackSchema); // ✅ Use correct model name
export default Track;
