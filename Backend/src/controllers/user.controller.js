const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");
const postModel = require("../models/post.model");

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


async function getMyProfileController(req, res) {
  try {
    const userId = req.user.id;
    const username = req.user.username;

    // 1. Get user details
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Fetch Followers List
    const followersRecords = await followModel.find({
      followee: username,
      status: "accepted",
    });
    const followersUsernames = followersRecords.map(r => r.follower);
    const followers = await userModel.find({ 
      username: { $in: followersUsernames } 
    }).select("username profileImage");

    // 3. Fetch Following List
    const followingRecords = await followModel.find({
      follower: username,
      status: "accepted",
    });
    const followingUsernames = followingRecords.map(r => r.followee);
    const following = await userModel.find({ 
      username: { $in: followingUsernames } 
    }).select("username profileImage");

    // 4. Fetch Suggestions (Users you are NOT following, excluding yourself)
    const suggestions = await userModel.find({
      username: { $nin: [...followingUsernames, username] }
    }).limit(5).select("username profileImage");

    // 5. Get all posts created by this user
    const posts = await postModel.find({ user: userId }).sort({ _id: -1 });

    res.status(200).json({
      profile: {
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage,
        followersCount: followers.length,
        followingCount: following.length,
        postsCount: posts.length,
      },
      followers,
      following,
      suggestions,
      posts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  followUserController,
  unfollowUserController,
  acceptFollowRequestController,
  rejectFollowRequestController,
  getMyProfileController,
};