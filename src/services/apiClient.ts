import { apiServices } from "./axios";

const api = apiServices({
  baseURL: process.env.NEXT_PUBLIC_URL_BACKEND || "https://cryptocurrency-api-three.vercel.app/api", // Set your base URL
  headers: {
    "Content-Type": "application/json",
  },
  // Add more default configurations as needed
});

export { api };
