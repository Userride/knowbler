import axios from "axios";

const apiBaseUrl = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const fetchAllArticles = async (queryParams = {}) => {
  const response = await axiosInstance.get("/articles", { params: queryParams });
  return response.data;
};

export const searchArticlesByKeyword = async (searchKeyword, queryParams = {}) => {
  const response = await axiosInstance.get("/articles/search", {
    params: { q: searchKeyword, ...queryParams },
  });
  return response.data;
};

/**
 * Fetch a single article's full details.
 * @param {string} articleId - The article's articleId string (e.g. "ART-000001")
 * @param {boolean} isPreview - If true, view count will NOT be incremented (hover previews)
 */
export const fetchSingleArticle = async (articleId, isPreview = true) => {
  const response = await axiosInstance.get(`/articles/${articleId}`, {
    params: isPreview ? { preview: "true" } : {},
  });
  return response.data;
};

export default axiosInstance;
