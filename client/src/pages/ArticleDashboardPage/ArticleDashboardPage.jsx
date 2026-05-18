import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import NavigationSidebar from "../../components/NavigationSidebar/NavigationSidebar";
import ArticleList from "../../components/ArticleList/ArticleList";
import { fetchAllArticles, searchArticlesByKeyword } from "../../services/articleService";
import "./ArticleDashboardPage.css";

const ARTICLES_PER_PAGE = 15;
const SEARCH_DEBOUNCE_DELAY_MS = 350;

const ArticleDashboardPage = () => {
  const [articleList, setArticleList] = useState([]);
  const [totalArticleCount, setTotalArticleCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [isLoadingMoreArticles, setIsLoadingMoreArticles] = useState(false);
  const [articleFetchError, setArticleFetchError] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [activeSearchKeyword, setActiveSearchKeyword] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  // ── Initial / reset load ────────────────────────────────────────────
  const loadInitialArticles = async (searchKeyword = "") => {
    try {
      setIsLoadingArticles(true);
      setArticleFetchError(null);
      setArticleList([]);
      setCurrentPage(1);
      setHasMoreArticles(true);

      const responseData = searchKeyword
        ? await searchArticlesByKeyword(searchKeyword, { page: 1, limit: ARTICLES_PER_PAGE })
        : await fetchAllArticles({ page: 1, limit: ARTICLES_PER_PAGE });

      const fetchedArticles = responseData.data || [];
      const totalCount = responseData.pagination?.totalArticles || 0;

      setArticleList(fetchedArticles);
      setTotalArticleCount(totalCount);
      setHasMoreArticles(fetchedArticles.length < totalCount);
    } catch (fetchError) {
      setArticleFetchError(
        fetchError.response?.data?.message ||
        "Could not connect to the server. Please make sure the backend is running."
      );
    } finally {
      setIsLoadingArticles(false);
    }
  };

  // ── Load next page (appends to existing list) ───────────────────────
  const loadNextPageOfArticles = async () => {
    if (isLoadingMoreArticles || !hasMoreArticles) return;

    try {
      setIsLoadingMoreArticles(true);
      const nextPage = currentPage + 1;

      const responseData = activeSearchKeyword
        ? await searchArticlesByKeyword(activeSearchKeyword, { page: nextPage, limit: ARTICLES_PER_PAGE })
        : await fetchAllArticles({ page: nextPage, limit: ARTICLES_PER_PAGE });

      const newArticles = responseData.data || [];
      const totalCount = responseData.pagination?.totalArticles || 0;

      setArticleList((previousArticles) => [...previousArticles, ...newArticles]);
      setCurrentPage(nextPage);
      setHasMoreArticles(articleList.length + newArticles.length < totalCount);
    } catch (loadMoreError) {
      console.error("Failed to load more articles:", loadMoreError.message);
    } finally {
      setIsLoadingMoreArticles(false);
    }
  };

  useEffect(() => {
    loadInitialArticles(activeSearchKeyword);
  }, [activeSearchKeyword]);

  // ── Search with debounce ────────────────────────────────────────────
  const handleSearchInputChange = (newSearchValue) => {
    setSearchInputValue(newSearchValue);
    setActiveSearchKeyword(newSearchValue);
  };

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="article-dashboard-page">
      <Header
        onMenuToggle={handleMenuToggle}
        searchInputValue={searchInputValue}
        onSearchChange={handleSearchInputChange}
        totalArticleCount={totalArticleCount}
      />
      <NavigationSidebar
        isSidebarOpen={isSidebarOpen}
        onSidebarClose={handleSidebarClose}
      />
      <main className="article-dashboard-main-content">
        <ArticleList
          articleList={articleList}
          isLoadingArticles={isLoadingArticles}
          isLoadingMoreArticles={isLoadingMoreArticles}
          hasMoreArticles={hasMoreArticles}
          articleFetchError={articleFetchError}
          onRetryFetch={() => loadInitialArticles(activeSearchKeyword)}
          onLoadMoreArticles={loadNextPageOfArticles}
        />
      </main>
    </div>
  );
};

export default ArticleDashboardPage;
