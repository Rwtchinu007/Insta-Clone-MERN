const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const identifyUser = require("../middlewares/auth.middleware");

/**
 * @route GET /api/users/profile
 * @description get the current user's profile overview
 * @access private
 */
userRouter.get(
  "/profile",
  identifyUser,
  userController.getProfileOverviewController,
);

/**
 * @route POST /api/users/follow/:userid
 * @description follow a user
 * @access private
 *  */
userRouter.post(
  "/follow/:username",
  identifyUser,
  userController.followUserController,
);
/**
 * @route POST /api/users/unfollow/:userid
 * @description Unfollow a user
 * @access private
 *  */
userRouter.post(
  "/unfollow/:username",
  identifyUser,
  userController.unfollowUserController,
);

/**
 * @route PATCH /api/users/follow/:username/accept
 * @description Accept a follow request
 * @access private
 */
userRouter.patch(
  "/follow/:username/accept",
  identifyUser,
  userController.acceptFollowRequestController,
);


/**
 * @route PATCH /api/users/follow/:username/reject
 * @description Reject a follow request
 * @access private
 */
userRouter.patch(
  "/follow/:username/reject",
  identifyUser,
  userController.rejectFollowRequestController,
);

module.exports = userRouter;
