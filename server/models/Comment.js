const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        postId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);