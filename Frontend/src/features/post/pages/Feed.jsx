import { useEffect } from "react";
import "../style/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hook/usePost";
import Nav from "../../shared/components/Nav";

const Feed = () => {
  const { feed, loading, handleGetFeed, handleLikePost, handleUnlikePost } =
    usePost();

  useEffect(() => {
    handleGetFeed();
  }, []);

  if (loading) {
    return (
      <>
        {" "}
        <Nav />
        <main className="feed-page">
          <div className="loader"></div>
        </main>
      </>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <>
        {" "}
        <Nav />
        <main className="feed-page">
          <div className="empty-feed">
            <h2>No Posts Yet</h2>
            <p>Follow people or create a post to get started.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {" "}
      <Nav />
      <main className="feed-page">
        <div className="feed">
          <div className="posts">
            {feed.map((post) => (
              <Post
                key={post._id}
                user={post.user}
                post={post}
                handleLikePost={handleLikePost}
                handleUnlikePost={handleUnlikePost}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Feed;
