import { model, Schema } from "mongoose";

const likeSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        trackId: {
            type: Schema.Types.ObjectId,
            ref: "Track",
        }
    },
    { timestamps: true }
);

const Like = model('Like', likeSchema);
export default Like
