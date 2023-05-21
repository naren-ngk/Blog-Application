const router = require("express").Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");

router.post("/", async (req, res) => {
    const comment = new Comment(req.body);
    try {
        const savedComment = await comment.save();
        res.status(200).json(savedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (comment.name === req.body.username) {
            try {
                await comment.delete();
                res.status(200).json("comment has been deleted...");
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("You can delete only your comment!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
