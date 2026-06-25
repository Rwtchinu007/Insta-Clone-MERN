import axios from "axios";

const api = axios.create({
  // 1. Use the relative path so it works locally AND on Render automatically
  baseURL: "/api/posts", 
  withCredentials: true,
});

export async function getFeed() {
  // 2. This now automatically calls /api/posts/feed
  const response = await api.get("/feed");
  return response.data;
}

export async function createPost(imageFile, caption) {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("caption", caption);
  
  // 3. This automatically calls /api/posts
  const response = await api.post("/", formData);
  return response.data;
}

export async function likePost(postId) {
  // 4. This automatically calls /api/posts/like/:postId
  const response = await api.post(`/like/${postId}`);
  return response.data;
}

export async function unlikePost(postId) {
  // 5. This automatically calls /api/posts/unlike/:postId
  const response = await api.post(`/unlike/${postId}`);
  return response.data;
}