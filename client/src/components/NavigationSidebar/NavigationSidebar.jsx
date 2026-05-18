import React from "react";
import "./NavigationSidebar.css";

import { Home, User, Bell, CheckSquare, Folder, UserCheck } from "lucide-react";
import logoIcon from "../../assets/logo-icon.svg";

const sidebarNavigationItems = [
  { id: "home", label: "Home", icon: <Home size={16} />, badgeCount: null, badgeColor: null, isActive: true },
  { id: "profile", label: "Profile", icon: <User size={16} />, badgeCount: null, badgeColor: null, isActive: false },
];

const sidebarNotificationItems = [
  { id: "review-returned", label: "Review Returned", icon: <CheckSquare size={16} />, badgeCount: 3, badgeColor: "red", isActive: false },
  { id: "cases-needing-articles", label: "Cases Needing Articles", icon: <Folder size={16} />, badgeCount: 3, badgeColor: "purple", isActive: false },
];

const sidebarBottomItems = [
  { id: "agent", label: "Agent", icon: <UserCheck size={16} />, badgeCount: null, badgeColor: null, isActive: false },
];

const NavigationSidebar = ({ isSidebarOpen, onSidebarClose }) => {
  return (
    <>
      {isSidebarOpen && (
        <div className="navigation-sidebar-overlay" onClick={onSidebarClose} aria-hidden="true" />
      )}
      <nav
        className={`navigation-sidebar ${isSidebarOpen ? "navigation-sidebar--open" : ""}`}
        aria-label="Main navigation"
        aria-hidden={!isSidebarOpen}
      >
        <div className="navigation-sidebar-header">
          <div className="navigation-sidebar-logo-icon">
            <img src={logoIcon} alt="logo" />
          </div>
          <span className="navigation-sidebar-logo-text">knowbler</span>
        </div>

        <div className="navigation-sidebar-nav">
          {sidebarNavigationItems.map((navItem) => (
            <div
              key={navItem.id}
              className={`navigation-sidebar-nav-item ${navItem.isActive ? "navigation-sidebar-nav-item--active" : ""}`}
            >
              <div className="navigation-sidebar-nav-item-left">
                <span className="navigation-sidebar-nav-icon">{navItem.icon}</span>
                <span className="navigation-sidebar-nav-label">{navItem.label}</span>
              </div>
            </div>
          ))}

          <div className="navigation-sidebar-section-label">Notifications</div>

          {sidebarNotificationItems.map((navItem) => (
            <div key={navItem.id} className="navigation-sidebar-nav-item">
              <div className="navigation-sidebar-nav-item-left">
                <span className="navigation-sidebar-nav-icon">{navItem.icon}</span>
                <span className="navigation-sidebar-nav-label">{navItem.label}</span>
              </div>
              {navItem.badgeCount && (
                <span className={`navigation-sidebar-notification-badge navigation-sidebar-notification-badge--${navItem.badgeColor}`}>
                  {navItem.badgeCount}
                </span>
              )}
            </div>
          ))}

          {sidebarBottomItems.map((navItem) => (
            <div key={navItem.id} className="navigation-sidebar-nav-item" style={{ marginTop: 8 }}>
              <div className="navigation-sidebar-nav-item-left">
                <span className="navigation-sidebar-nav-icon">{navItem.icon}</span>
                <span className="navigation-sidebar-nav-label">{navItem.label}</span>
              </div>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
};

export default NavigationSidebar;
