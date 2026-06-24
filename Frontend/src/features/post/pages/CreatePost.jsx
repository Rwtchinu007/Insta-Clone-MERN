import React, { useState, useRef } from "react";
import "../style/createPost.scss";
import { usePost } from "../hook/usePost";
import { useNavigate } from "react-router";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const postImageInputFieldRef = useRef(null);
  const { loading, handleCreatePost } = usePost();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const file = postImageInputFieldRef.current.files[0];

    if (!file) {
      setError("Please select an image");
      return;
    }

    try {
      await handleCreatePost(file, caption);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create post");
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  function handleClearImage() {
    setPreview(null);
    // reset the file input so the same file can be re-selected
    if (postImageInputFieldRef.current) {
      postImageInputFieldRef.current.value = "";
    }
  }

  const nearLimit = caption.length > 2000;
  const atLimit   = caption.length === 2200;

  return (
    <main className="create-post-page">
      <div className="form-container">

        {/* ── Header ── */}
        <div className="form-header">
          <div className="form-logo" />
          <h1>Create post</h1>
          <p>Share a moment with your followers</p>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">

          {/* ── Image upload or preview ── */}
          {!preview ? (
            <label className="post-image-label" htmlFor="postImage">
              <div className="upload-icon">
                {/* upload cloud icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </div>
              <span className="upload-text">Choose a photo</span>
              <span className="upload-hint">JPG or PNG · max 10MB</span>
            </label>
          ) : (
            <div className="preview-wrapper">
              <img className="preview-image" src={preview} alt="Preview" />
              <div className="preview-overlay" onClick={handleClearImage}>
                <span>Change photo</span>
              </div>
            </div>
          )}

          {/* hidden file input */}
          <input
            ref={postImageInputFieldRef}
            hidden
            type="file"
            accept="image/*"
            id="postImage"
            onChange={handleImageChange}
          />

          {/* ── Caption ── */}
          <div className="caption-wrapper">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption…"
              maxLength={2200}
            />
            <span className={`caption-count ${nearLimit ? "near-limit" : ""} ${atLimit ? "at-limit" : ""}`}>
              {caption.length} / 2200
            </span>
          </div>

          {/* ── Error ── */}
          {error && <p className="error-message">{error}</p>}

          {/* ── Submit ── */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Sharing…" : "Share"}
          </button>

        </form>
      </div>
    </main>
  );
};

export default CreatePost;