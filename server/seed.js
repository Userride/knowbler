require("dotenv").config();
const mongoose = require("mongoose");
const Article = require("./models/Article");

const articleCategories = ["General", "Authentication", "Billing", "Integration", "Security", "Performance", "UI/UX", "API", "Database", "Deployment"];
const articleTypes = ["How-to", "FAQ", "Troubleshooting", "Reference", "Policy"];
const statusOptions = ["Draft", "Published", "Review", "Archived"];
const channelOptions = [["Internal App"], ["Internal App", "Customer"], ["Customer"], ["All Channels"], ["Internal App", "Customer", "Partner"]];
const visibilityOptions = [["All Agents"], ["Admins Only"], ["Support Team"], ["All Agents", "Supervisors"]];
const agentNames = ["Sarah Mitchell", "James Thornton", "Priya Sharma", "Carlos Rivera", "Emily Chen", "David Okafor", "Rachel Nguyen", "Michael Burke", "Anna Kowalski", "Tom Henderson"];
const versionOptions = ["v0.5", "v1.0", "v1.1", "v1.2", "v2.0", "v2.1", "v3.0"];

const articleTitles = [
  "Incident Dashboard UI Loading Issues","Two-Factor Authentication Setup Guide for Desktop, Mobile, Tablet and Federated SSO Accounts Including Backup Codes and Recovery Flow","Bulk Export Fails for Large Tenants","Configuring SAML SSO with Okta and Azure AD","API Rate Limiting Best Practices","Migrating from REST Views to v4","SSO Setup Data — Common Pitfalls","Webhook Retry Behavior","Resolving Query Behavior in Advanced Search","Handling CSV Import Encoding Errors","Password Policy Enforcement Guide","Setting Up Email Notifications","Role-Based Access Control Overview","Data Retention and Archival Policy","Custom Field Configuration Guide","Integrating Slack Notifications","Troubleshooting Agent Login Failures","Mobile App Push Notification Setup","Multi-Language Support Configuration","Audit Log Access and Export","Session Timeout Configuration","Widget Customization for Customer Portal","Knowledge Base Indexing Delay","Chat Transcript Export Guide","Escalation Rules and SLA Policies","User Provisioning via SCIM","Custom Domain Setup for Help Center","IP Allowlist Configuration","Bulk User Import via CSV","Article Draft Versioning Guide","Automated Ticket Routing Rules","Canned Response Management","Reporting Dashboard Overview","Live Chat Queue Management","Customer Satisfaction Survey Setup","Agent Availability Status Rules","Ticket Merge and Linking Guide","Outbound Email Configuration","DKIM and SPF Record Setup","Data Export Compliance Guide","Integrating Salesforce CRM","Zendesk Migration Checklist","Chatbot Builder Configuration","NLP Intent Training Guide","Conversation Analytics Setup","Custom Branding for Agent Console","Holiday Schedule Configuration","Round-Robin Assignment Rules","Skill-Based Routing Setup","SLA Breach Notification Guide","Inbox Management Best Practices","Article Approval Workflow","Knowledge Base Search Tuning","Feedback Widget Integration","Portal Single Sign-On Guide","Agent Collision Detection","Response Time Analytics","Customer Tier Management","VIP Customer Handling Policy","Ticket Priority Escalation Rules","Macro and Template Management","Custom Status Configuration","Business Hours Setup Guide","Multi-Brand Support Configuration","API Webhook Security Best Practices","Conversation History Archival","Advanced Reporting Filters Guide","Team Performance Dashboard","Customer Portal Theme Customization","Accessibility Compliance Guide","GDPR Data Request Handling","Audit Trail for Sensitive Actions","Integration Health Monitoring","Error Code Reference Manual","System Status Page Configuration","Scheduled Maintenance Announcements","Backup and Disaster Recovery Policy","High Availability Setup Guide","Load Balancer Configuration","CDN Integration for Assets","Database Query Optimization Guide","Cache Invalidation Strategies","API Versioning Policy","SDK Installation Guide","Webhook Payload Reference","OAuth 2.0 Integration Guide","JWT Authentication Deep Dive","Multi-Factor Auth for API Access","Sandbox Environment Setup","Testing Checklist Before Go-Live","Change Management Process","Incident Response Playbook","Postmortem Template and Guide","Capacity Planning Guide","Cost Optimization Strategies","Team Onboarding Checklist","Agent Training Materials","Quality Assurance Scoring Guide","Customer Journey Mapping","Omnichannel Strategy Guide","Voice Channel Integration","Video Call Integration Setup","Co-browsing Configuration Guide","Screen Sharing Permission Rules",
];

const summaryTemplates = [
  "Investigating the root cause of UI loading failures on the Incident Dashboard.",
  "Step-by-step setup guide covering all authentication methods across device types.",
  "Resolving timeout and memory errors when exporting large data sets.",
  "Configuring identity providers for seamless single sign-on integration.",
  "Best practices for managing API consumption to avoid throttling.",
  "Guide to migrating legacy REST endpoints to the newer v4 API format.",
  "Common configuration mistakes and how to avoid them during SSO setup.",
  "Understanding retry mechanisms and backoff strategies for webhook delivery.",
  "Resolving unexpected behavior in the advanced search and filter module.",
  "Fixing character encoding issues when importing CSV files with special characters.",
  "Configuring password complexity, expiry, and reuse policies for compliance.",
  "Setting up automated email alerts for ticket updates and system events.",
  "Overview of roles, permissions, and access scopes available in the platform.",
  "Understanding data lifecycle policies and automatic archival schedules.",
  "Creating and managing custom fields for tickets, contacts, and companies.",
];

function getRandomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function getRandomDate(start, end) { return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())); }
function padArticleId(num) { return String(num).padStart(10, "0"); }

const dummyArticles = articleTitles.slice(0, 100).map((title, index) => {
  const createdDate = getRandomDate(new Date("2025-10-01"), new Date("2026-02-28"));
  const updatedDate = getRandomDate(createdDate, new Date("2026-05-01"));
  const creatorAgent = getRandomItem(agentNames);
  const modifierAgent = getRandomItem(agentNames);
  const summaryText = summaryTemplates[index % summaryTemplates.length];

  return {
    title,
    articleId: padArticleId(300000 + index + 1),
    category: getRandomItem(articleCategories),
    type: getRandomItem(articleTypes),
    summary: summaryText,
    resolution: `Step-by-step resolution: ${summaryText} Verify the configuration in the admin console, confirm permissions are propagated, then re-test from an end-user account to ensure the workflow completes successfully.`,
    language: "English",
    version: getRandomItem(versionOptions),
    visibility: getRandomItem(visibilityOptions),
    channels: getRandomItem(channelOptions),
    views: getRandomNumber(0, 500),
    status: getRandomItem(statusOptions),
    createdBy: creatorAgent,
    lastModifiedBy: modifierAgent,
    createdAt: createdDate,
    updatedAt: updatedDate,
  };
});

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    await Article.deleteMany({});
    console.log("Cleared existing articles");
    await Article.insertMany(dummyArticles);
    console.log(`Successfully seeded ${dummyArticles.length} articles`);
    await mongoose.disconnect();
    console.log("Database seeding complete");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

seedDatabase();
