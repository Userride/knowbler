import React from "react";
import "./StatusBadge.css";

const StatusBadge = ({ articleStatus }) => {
  const normalizedStatus = articleStatus?.toLowerCase() || "draft";
  return (
    <span className={`status-badge status-badge--${normalizedStatus}`}>
      {articleStatus || "Draft"}
    </span>
  );
};

export default StatusBadge;
