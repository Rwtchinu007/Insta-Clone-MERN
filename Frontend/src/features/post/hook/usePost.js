import { getFeed, createPost, likePost, unlikePost } from "../services/post.api.js";
import { useContext } from "react";
import { postContext } from "../post.context.jsx";

export const usePost = () => {
  const context = useContext(postContext);
  const { loading, setLoading, post, setPost, feed, setFeed } = context;

  const handleGetFeed = async () => {
    setLoading(true);
    try {
      const data = await getFeed();
      setFeed(data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (imageFile, caption) => {
    setLoading(true);
    try {
      const data = await createPost(imageFile, caption);
      setFeed([data.post, ...(feed || [])]);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

 const handleLikePost = async (postId) => {
    // Optimistic Update: Instantly turn the heart red AND increase the like count by 1
    setFeed((prevFeed) =>
      prevFeed.map((p) =>
        p._id === postId 
          ? { ...p, isLiked: true, likes: [...(p.likes || []), "mock_like"] } 
          : p
      )
    );

    try {
      await likePost(postId);
    } catch (error) {
      // Revert if the server fails
      setFeed((prevFeed) =>
        prevFeed.map((p) =>
          p._id === postId 
            ? { ...p, isLiked: false, likes: (p.likes || []).slice(0, -1) } 
            : p
        )
      );
    }
  };

  const handleUnlikePost = async (postId) => {
    // Optimistic Update: Instantly remove the red heart AND decrease the like count by 1
    setFeed((prevFeed) =>
      prevFeed.map((p) =>
        p._id === postId 
          ? { ...p, isLiked: false, likes: (p.likes || []).slice(0, -1) } 
          : p
      )
    );

    try {
      await unlikePost(postId);
    } catch (error) {
      // Revert if the server fails
      setFeed((prevFeed) =>
        prevFeed.map((p) =>
          p._id === postId 
            ? { ...p, isLiked: true, likes: [...(p.likes || []), "mock_like"] } 
            : p
        )
      );
    }
  };
  // NOTE: Removed useEffect! Feed.jsx is already handling the initial fetch.

  return { loading, post, feed, handleGetFeed, handleCreatePost, handleLikePost, handleUnlikePost };
};