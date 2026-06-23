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
  const username = req.user.username;
  const postId = req.params.postId;
  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }
  const like = await likeModel.create({
    post: postId,
    user: username,
  });
  res.status(200).json({
    mesage: "Post like successfully",
    like,
  });
}

async function unlikePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;
  const isLiked = await likeModel.findOne({
    user: username,
    post: postId,
});
 if (!isLiked) {
    return res.status(404).json({
      message: "Post not liked yet",
    });
  }

  await likeModel.findByIdAndDelete(isLiked._id);
  res.status(200).json({
    message: "Post unliked successfully",
  });

}

async function getFeedController(req, res) {
  const user = req.user;
  const posts = await Promise.all(
    (await postModel.find().populate("user").sort({_id:-1}). lean()).map(async (post) => {
      const isLiked = await likeModel.findOne({
        user: user.username,
        post: post._id, 
      });

      post.isLiked = Boolean(isLiked);
      return post;
    }),
  );
  // lean is used to get the plain javascript object instead of mongoose document. This is done to add the isLiked property to the post object before sending it to the client.
  // await promise.all is used to wait for all the posts to be fetched from the database before sending the response to the client.
  // populate is used to get the user details from the user model using the user id stored in the post model.
  res.status(200).json({
    message: "Feed fetched successfully",
    posts,
  });
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  getFeedController,
  unlikePostController,
};
