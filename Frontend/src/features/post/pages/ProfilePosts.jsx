import { useCallback, useEffect, useState } from "react";
import Nav from "../../shared/components/Nav.jsx";
import Post from "../components/Post";
import {
  followUser,
  getProfileOverview,
  unfollowUser,
} from "../services/user.api.js";
import { likePost, unlikePost } from "../services/post.api.js";
import "../style/profile.scss";

const ProfilePosts = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const hydrateProfile = useCallback(async () => {
    const data = await getProfileOverview();
    setProfile(data);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeProfile = async () => {
      const data = await getProfileOverview();

      if (isMounted) {
        setProfile(data);
        setLoading(false);
      }
    };

    void initializeProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshAfterAction = async (username, handler) => {
    setActionLoading(username);
    try {
      await handler();
      await hydrateProfile();
    } finally {
      setActionLoading("");
    }
  };

  const handleFollow = async (username) => {
    await refreshAfterAction(username, () => followUser(username));
  };

  const handleUnfollow = async (username) => {
    await refreshAfterAction(username, () => unfollowUser(username));
  };

  const handleLikePost = async (postId) => {
    await refreshAfterAction(postId, () => likePost(postId));
  };

  const handleUnlikePost = async (postId) => {
    await refreshAfterAction(postId, () => unlikePost(postId));
  };

  const getButtonLabel = (action) => {
    if (action === "unfollow") {
      return "Unfollow";
    }

    if (action === "pending") {
      return "Requested";
    }

    return "Follow";
  };

  const renderUserList = (title, users) => (
    <section className="profile-card">
      <div className="section-heading">
        <h2>{title}</h2>
        <span>{users.length}</span>
      </div>
      <div className="user-list">
        {users.length === 0 ? (
          <p className="empty-state">Nothing here yet.</p>
        ) : (
          users.map((user) => (
            <div className="user-row" key={user.username}>
              <div className="user-meta">
                <img src={user.profileImage} alt={user.username} />
                <div>
                  <p>{user.username}</p>
                  <span>{user.bio || "No bio yet"}</span>
                </div>
              </div>
              <button
                className="btn primary-btn user-action"
                onClick={() => {
                  if (user.action === "unfollow") {
                    handleUnfollow(user.username);
                  }

                  if (user.action === "follow") {
                    handleFollow(user.username);
                  }
                }}
                disabled={
                  actionLoading === user.username || user.action === "pending"
                }
              >
                {getButtonLabel(user.action)}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );

  if (loading || !profile) {
    return (
      <main className="profile-page">
        <Nav />
        <div className="profile-shell">
          <p className="loading-state">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <Nav />
      <div className="profile-shell">
        <aside className="profile-sidebar">
          {renderUserList("Followers", profile.followers)}
          {renderUserList("Following", profile.following)}
          {renderUserList("Suggestions", profile.suggestions)}
        </aside>

        <section className="profile-main">
          <article className="profile-summary profile-card">
            <img src={profile.user.profileImage} alt={profile.user.username} />
            <div>
              <h1>{profile.user.username}</h1>
              <p>{profile.user.bio || "No bio available"}</p>
              <div className="profile-stats">
                <span>{profile.counts.posts} posts</span>
                <span>{profile.counts.followers} followers</span>
                <span>{profile.counts.following} following</span>
              </div>
            </div>
          </article>

          <section className="posts-column">
            {profile.posts.length === 0 ? (
              <p className="empty-state">No posts yet.</p>
            ) : (
              profile.posts.map((post) => (
                <Post
                  key={post._id}
                  user={post.user}
                  post={post}
                  handleLikePost={handleLikePost}
                  handleUnlikePost={handleUnlikePost}
                />
              ))
            )}
          </section>
        </section>
      </div>
    </main>
  );
};

export default ProfilePosts;
