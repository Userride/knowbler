import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArticleDashboardPage from "./pages/ArticleDashboardPage/ArticleDashboardPage";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ArticleDashboardPage />} />

      </Routes>
    </Router>
  );
};

export default App;
