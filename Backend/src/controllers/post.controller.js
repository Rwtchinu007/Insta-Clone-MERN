const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  console.log(req.body, req.file);

  // console.log(decoded);

  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "Cohort-2-Insta-clone-posts",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
}

async function getPostController(req, res) {
  const userId = req.user.id;
  const posts = await postModel.find({
    user: userId,
  });
  res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
}

async function getPostDetailsController(req, res) {
  const userId = req.user.id;
  const postId = req.params.postId;
  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found.",
    });
  }
  const isValidUser = post.user.toString() === userId;
  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden content.",
    });
  }
  return res.status(200).json({
    message: "Post fetched successfully",
    post,
  });
}

async function likePostController(req, res) {
  try {
    const username = req.user.username;
    const postId = req.params.postId;
    
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if already liked to prevent server crash
    const existingLike = await likeModel.findOne({ post: postId, user: username });
    if (existingLike) {
        return res.status(400).json({ message: "Already liked" });
    }

    const like = await likeModel.create({
      post: postId,
      user: username,
    });
    
    res.status(200).json({ message: "Post liked successfully", like });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function unlikePostController(req, res) {
  try {
    const username = req.user.username;
    const postId = req.params.postId;
    
    const isLiked = await likeModel.findOne({
      user: username,
      post: postId,
    });
    
    if (!isLiked) {
      return res.status(404).json({ message: "Post not liked yet" });
    }

    await likeModel.findByIdAndDelete(isLiked._id);
    res.status(200).json({ message: "Post unliked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getFeedController(req, res) {
  try {
    const user = req.user;
    const posts = await Promise.all(
      (await postModel.find().populate("user").sort({_id:-1}).lean()).map(async (post) => {
        // Check if current user liked it
        const isLiked = await likeModel.findOne({
          user: user.username,
          post: post._id, 
        });
        
        // Get total likes count for this post
        const totalLikes = await likeModel.countDocuments({ post: post._id });

        post.isLiked = Boolean(isLiked);
        post.likes = new Array(totalLikes); // Mock array so post.likes.length works in frontend
        return post;
      })
    );

    res.status(200).json({ message: "Feed fetched successfully", posts });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  getFeedController,
  unlikePostController,
};
