const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
// multer reads form data it has two storage
// disk storage and memory storage
const upload = multer({ storage: multer.memoryStorage() });
const identifyUser = require("../middlewares/auth.middleware");

// @routes POST /api/posts {protected}
//  @description create a post with caption and image 
//  @access private
// req.body = {caption,image-file}
postRouter.post(
  "/",
  upload.single("image"),
  identifyUser,
  postController.createPostController,
);

/**
 * GET/api/posts {protected}
 * return all the posts of the user from where the request came.
 * @access private
 */
postRouter.get("/", identifyUser, postController.getPostController);

/**
 * GET /api/posts/details/:postid
 * 
  * return detail about specific post with the id provided in the params.
  * It also checks whether the post belongs to the user from where the request came.
 */
postRouter.get(
  "/details/:postId",
  identifyUser,
  postController.getPostDetailsController,
);

/**
 * @route POST /api/posts/like/:postid
 * @description like a post with the id provided in the request params.
 */
postRouter.post("/like/:postId",identifyUser,postController.likePostController);



module.exports = postRouter;
