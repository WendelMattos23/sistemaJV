import axios from "axios";

export default axios.create({
  baseURL: "https://motorista-backend.onrender.com",
  timeout: 8000,
});
