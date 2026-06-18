import axios from "axios";
// we create baseURL for axios to avoid repeating the same URL in every request
const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true, // Include cookies in requests
});

export async function registerUser(username, email, password) {
  try { 
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}
export async function loginUser(username, password) {
  try {
    const response = await api.post("/login", {
      username,
      password,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getMe() {
    try{
        const response = await api.get("/get-me");
        return response.data;
    }
    catch(err){
        throw err;
    } 
}
