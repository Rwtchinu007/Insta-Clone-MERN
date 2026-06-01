const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
// multer reads form data it has two storage
// disk storage and memory storage
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/posts {protected}
// req.body = {caption,image-file}
postRouter.post(
  "/",
  upload.single("image"),
  postController.createPostController,
);

/**
 * GET/api/posts {protected}
 */
postRouter.get("/",postController.getPostController);



/**
 * GET /api/posts/details/:postid
 * return detail about specific post with the id.
 * It also checks whether the post belongs to the user from where the request came.
 */
postRouter.get("/details/:postId",postController.getPostDetailsController ) 

module.exports = postRouter;
