import { getFeed, createPost,likePost,unlikePost } from "../services/post.api.js";
import { useContext,useEffect } from "react";
import { postContext } from "../post.context.jsx";

export const usePost = () => {
  const context = useContext(postContext);
  const { loading, setLoading, post, setPost, feed, setFeed } = context;

  const handleGetFeed = async () => {
    setLoading(true);
    const data = await getFeed();
    setFeed(data.posts);
    setLoading(false);
  };

  const handleCreatePost = async (imageFile, caption) => {
    setLoading(true);
    const data = await createPost(imageFile, caption);
    setFeed([data.post, ...feed]);
    setLoading(false);
  };

  const handleLikePost = async (post) => {
    
    const data = await likePost(post);
    await handleGetFeed(); // Fetch the updated feed after liking a post
    
  }

  const handleUnlikePost = async (post) => {
  
    const data = await unlikePost(post);
    await handleGetFeed(); // Fetch the updated feed after unliking a post
    
  }

  useEffect(() => {
    handleGetFeed();
  }, []);
  // we are calling handleGetFeed function inside useEffect because we want to fetch the feed data when the component is mounted. And we are passing an empty array as a second argument to useEffect because we want to run this effect only once when the component is mounted.

  return { loading, post, feed, handleGetFeed, handleCreatePost, handleLikePost, handleUnlikePost };
};
