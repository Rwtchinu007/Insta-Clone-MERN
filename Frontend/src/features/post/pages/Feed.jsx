import React, { useEffect } from "react";
import "../style/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hook/usePost.js";

const Feed = () => {
  const { feed, handleGetFeed,loading } = usePost();
  useEffect(() => {
    handleGetFeed();
  }, []);
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
      <div className="feed">
        <div className="posts">
          {feed.map((post)=>{
            return <Post user={post.user} post={post} key={post._id} />
          })}
        </div>
      </div>
    </main>
  );
};

export default Feed;
