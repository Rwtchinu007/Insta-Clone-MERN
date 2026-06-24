import { useState, useRef } from "react";
import "../style/createPost.scss";
import { usePost } from "../hook/usePost.js";
import { useNavigate } from "react-router";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const postImageInputFieldRef = useRef(null);
  const { loading, handleCreatePost } = usePost();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const file = postImageInputFieldRef.current.files[0];
    // it means we can access the file that user has selected from the input field using the ref and then we can send it to the backend using form data
    await handleCreatePost(file, caption);

    navigate("/");   
  }

  if (loading) {
    return (
      <main>
        <h1>Creating Post...</h1>
      </main>
    );
  }

  return (
    <main className="create-post-page">
      <div className="form-container">
        <h1>Create Post</h1>
        <form onSubmit={handleSubmit} className="create-post-form">
          <label className="post-image-label" htmlFor="postImage">
            Select Image
          </label>
          <input
            ref={postImageInputFieldRef}
            hidden
            type="file"
            name="postImage"
            id="postImage"
          />
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            name="caption"
            id="caption"
            placeholder="Caption"
          />
          <button className="btn primary-btn">Post</button>
        </form>
      </div>
    </main>
  );
};

export default CreatePost;
