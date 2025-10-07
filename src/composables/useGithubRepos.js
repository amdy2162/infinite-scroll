import axios from "axios";

export const github = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

const token = import.meta.env.VITE_GITHUB_TOKEN;
if (token) {
  github.defaults.headers.common.Authorization = `Bearer ${token}`;
}