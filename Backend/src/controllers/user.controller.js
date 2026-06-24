const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const likeModel = require("../models/like.model");

function mapUserCard(user, action) {
  return {
    username: user.username,
    bio: user.bio,
    profileImage: user.profileImage,
    action,
  };
}

async function getProfileOverviewController(req, res) {
  const currentUser = await userModel.findById(req.user.id).lean();

  if (!currentUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const relations = await followModel
    .find({
      $or: [{ follower: currentUser.username }, { followee: currentUser.username }],
    })
    .lean();

  const users = await userModel
    .find({
      _id: { $ne: currentUser._id },
    })
    .lean();

  const usersByUsername = new Map(users.map((user) => [user.username, user]));
  const outgoingMap = new Map();
  const incomingMap = new Map();

  relations.forEach((relation) => {
    if (relation.follower === currentUser.username) {
      outgoingMap.set(relation.followee, relation.status);
    }
    if (relation.followee === currentUser.username) {
      incomingMap.set(relation.follower, relation.status);
    }
  });

  const following = relations
    .filter(
      (relation) =>
        relation.follower === currentUser.username &&
        relation.status === "accepted",
    )
    .map((relation) => {
      const user = usersByUsername.get(relation.followee);

      return user ? mapUserCard(user, "unfollow") : null;
    })
    .filter(Boolean);

  const followers = relations
    .filter(
      (relation) =>
        relation.followee === currentUser.username &&
        relation.status === "accepted",
    )
    .map((relation) => {
      const user = usersByUsername.get(relation.follower);
      const outgoingStatus = outgoingMap.get(relation.follower);

      if (!user) {
        return null;
      }

      if (outgoingStatus === "accepted") {
        return mapUserCard(user, "unfollow");
      }

      if (outgoingStatus === "pending") {
        return mapUserCard(user, "pending");
      }

      return mapUserCard(user, "follow");
    })
    .filter(Boolean);

  const relationUsernames = new Set([
    ...outgoingMap.keys(),
    ...incomingMap.keys(),
  ]);

  const suggestions = users
    .filter((user) => !relationUsernames.has(user.username))
    .map((user) => mapUserCard(user, "follow"));

  const posts = await Promise.all(
    (
      await postModel
        .find({
          user: currentUser._id,
        })
        .populate("user")
        .sort({ _id: -1 })
        .lean()
    ).map(async (post) => {
      const isLiked = await likeModel.findOne({
        user: currentUser.username,
        post: post._id,
      });

      return {
        ...post,
        isLiked: Boolean(isLiked),
      };
    }),
  );

  return res.status(200).json({
    message: "Profile data fetched successfully",
    user: {
      username: currentUser.username,
      email: currentUser.email,
      bio: currentUser.bio,
      profileImage: currentUser.profileImage,
    },
    counts: {
      followers: followers.length,
      following: following.length,
      suggestions: suggestions.length,
      posts: posts.length,
    },
    followers,
    following,
    suggestions,
    posts,
  });
}

async function followUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  // Check if the user being followed actually exists
  const isFolloweeExists = await userModel.findOne({
    username: followeeUsername,
  });

  if (!isFolloweeExists) {
    return res.status(404).json({
      message: "User does not exist",
    });
  }

  // Prevent following yourself
  if (followerUsername == followeeUsername) {
    return res.status(400).json({
      message: "You cannot follow yourself",
    });
  }

  // Check if a follow record already exists between these two users
  const isAlreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (isAlreadyFollowing) {
    // If previously rejected, allow re-sending the request
    if (isAlreadyFollowing.status === "rejected") {
      isAlreadyFollowing.status = "pending";
      await isAlreadyFollowing.save();
      return res.status(200).json({
        message: `Follow request re-sent to ${followeeUsername}`,
        follow: isAlreadyFollowing,
      });
    }

    // If pending or accepted, just inform the user
    return res.status(200).json({
      message: `You already have a ${isAlreadyFollowing.status} follow request with ${followeeUsername}`,
      follow: isAlreadyFollowing,
    });
  }

  // No existing record found, create a fresh follow request
  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
  });

  res.status(201).json({
    message: `Follow request sent to ${followeeUsername}`,
    follow: followRecord,
  });
}

async function unfollowUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  // Check if a follow record exists
  const isUserFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (!isUserFollowing) {
    return res.status(200).json({
      message: `You are not following ${followeeUsername}`,
    });
  }

  // Delete the follow record permanently
  await followModel.findByIdAndDelete(isUserFollowing._id);

  res.status(200).json({
    message: `You have unfollowed ${followeeUsername}`,
  });
}

async function acceptFollowRequestController(req, res) {
  // Logged-in user is the FOLLOWEE (the one accepting the request)
  const followeeUsername = req.user.username;
  // URL param is the FOLLOWER (the one who sent the request)
  const followerUsername = req.params.username;

  // Find a pending follow request from that specific user
  const followRecord = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
    status: "pending",
  });

  if (!followRecord) {
    return res.status(404).json({
      message: "No pending follow request found from this user",
    });
  }

  // Update status to accepted and save
  followRecord.status = "accepted";
  await followRecord.save();

  res.status(200).json({
    message: `You accepted ${followerUsername}'s follow request`,
    follow: followRecord,
  });
}

async function rejectFollowRequestController(req, res) {
  // Logged-in user is the FOLLOWEE (the one rejecting the request)
  const followeeUsername = req.user.username;
  // URL param is the FOLLOWER (the one who sent the request)
  const followerUsername = req.params.username;

  // Find a pending follow request from that specific user
  const followRecord = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
    status: "pending",
  });

  if (!followRecord) {
    return res.status(404).json({
      message: "No pending follow request found from this user",
    });
  }

  // Update status to rejected and save
  followRecord.status = "rejected";
  await followRecord.save();

  res.status(200).json({
    message: `You rejected ${followerUsername}'s follow request`,
    follow: followRecord,
  });
}

module.exports = {
  getProfileOverviewController,
  followUserController,
  unfollowUserController,
  acceptFollowRequestController,
  rejectFollowRequestController,
};