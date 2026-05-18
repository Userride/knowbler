import React from "react";
import "./NavigationSidebar.css";

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const ReviewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);

const CasesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);

const AgentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const KnowblerLogoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

const sidebarNavigationItems = [
  { id: "home", label: "Home", icon: <HomeIcon />, badgeCount: null, badgeColor: null, isActive: true },
  { id: "profile", label: "Profile", icon: <ProfileIcon />, badgeCount: null, badgeColor: null, isActive: false },
];

const sidebarNotificationItems = [
  { id: "review-returned", label: "Review Returned", icon: <ReviewIcon />, badgeCount: 3, badgeColor: "red", isActive: false },
  { id: "cases-needing-articles", label: "Cases Needing Articles", icon: <CasesIcon />, badgeCount: 3, badgeColor: "purple", isActive: false },
];

const sidebarBottomItems = [
  { id: "agent", label: "Agent", icon: <AgentIcon />, badgeCount: null, badgeColor: null, isActive: false },
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
            <KnowblerLogoIcon />
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
