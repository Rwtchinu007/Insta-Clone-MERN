import React, { useEffect, useState } from "react";
import Nav from "../../shared/components/Nav";
import { getMyProfile } from "../services/profile.api";
import "../styles/profile.scss";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [modalType, setModalType] = useState(null); // 'followers' or 'following'

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfileData(data.profile);
        setPosts(data.posts);
        setFollowers(data.followers);
        setFollowing(data.following);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <>
        <Nav />
        <main className="profile-page">
          <div className="loader"></div>
        </main>
      </>
    );
  }

  if (error || !profileData) {
    return (
      <>
        <Nav />
        <main className="profile-page">
          <div className="error-message">{error}</div>
        </main>
      </>
    );
  }

  const listToRender = modalType === 'followers' ? followers : following;

  return (
    <>
      <Nav />
      <main className="profile-page">
        {/* Changed from layout-grid to a centered container */}
        <div className="profile-container">
          
          {/* ── Main Profile Content ── */}
          <div className="profile-main-content">
            <header className="profile-header">
              <div className="profile-avatar">
                <img src={profileData.profileImage} alt={profileData.username} />
              </div>

              <div className="profile-info">
                <div className="profile-title">
                  <h2>{profileData.username}</h2>
                  <button className="edit-btn">Edit Profile</button>
                </div>

                <div className="profile-stats">
                  <span><strong>{profileData.postsCount}</strong> posts</span>
                  <span className="clickable-stat" onClick={() => setModalType('followers')}>
                    <strong>{profileData.followersCount}</strong> followers
                  </span>
                  <span className="clickable-stat" onClick={() => setModalType('following')}>
                    <strong>{profileData.followingCount}</strong> following
                  </span>
                </div>

                <div className="profile-bio">
                  <p>{profileData.bio || "No bio yet."}</p>
                </div>
              </div>
            </header>

            <div className="profile-tabs">
              <div className="tab active">POSTS</div>
            </div>

            <div className="post-grid">
              {posts.length === 0 ? (
                <div className="no-posts">
                  <p>No posts yet.</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className="grid-item">
                    <img src={post.imgUrl} alt="User post" />
                    <div className="grid-overlay">
                      <span>❤️ {post.likes?.length || 0}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── MODAL ── */}
        {modalType && (
          <div className="modal-overlay" onClick={() => setModalType(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{modalType === 'followers' ? 'Followers' : 'Following'}</h3>
                <button onClick={() => setModalType(null)}>✕</button>
              </div>
              <div className="modal-list">
                {listToRender.length === 0 ? (
                  <p className="empty-list">No users found.</p>
                ) : (
                  listToRender.map((user) => (
                    <div key={user._id} className="modal-user-item">
                      <img src={user.profileImage} alt={user.username} />
                      <span>{user.username}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
};

export default Profile;