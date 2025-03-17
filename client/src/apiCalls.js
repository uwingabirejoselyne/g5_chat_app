import axios from "axios";
import axiosRetry from "axios-retry";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await ChatAppApi.post("/auth/login", userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

export const ChatAppApi = axios.create({
  baseURL:
    process.env.NODE_ENV !== "production"
      ? "http://localhost:8800/api"
      : "https://g5-chat-app.onrender.com/api",
  timeout: 5000,
});

axiosRetry(ChatAppApi, { retries: 3 });
