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
            type: Number,
        },
        genre: [
            {
                type: String,
                enum: GENRES, // restrict to your Genre union
            },
        ],
        albumId: {
            type: Schema.Types.ObjectId,
            ref: "Album",
            default: null,
        },
        language: {
            type: String,
            default: "English"
        }
    },
    { timestamps: true }
);

const Track = model("Track", trackSchema); // ✅ Use correct model name
export default Track;
