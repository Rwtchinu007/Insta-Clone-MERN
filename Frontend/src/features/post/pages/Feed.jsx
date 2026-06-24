import { useEffect } from "react";
import "../style/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hook/usePost.js";
import Nav from "../../shared/components/Nav.jsx";

const Feed = () => {
  const { feed, handleGetFeed, loading, handleLikePost, handleUnlikePost } = usePost();
  useEffect(() => {
    handleGetFeed();
  }, [handleGetFeed]);
  if(loading|| !feed){
    return (
      <main>
        <h1>Feed is loading...</h1>
      </main>
    )
  }
  console.log(feed);
  return (
    <main className="feed-page">
      <Nav/>
      <div className="feed">
        <div className="posts">
          {feed.map((post)=>{
            return <Post user={post.user} post={post} key={post._id} loading={loading} handleLikePost={handleLikePost} handleUnlikePost={handleUnlikePost}/>
          })}
        </div>
      </div>
    </main>
  );
};

export default Feed;
