// Google brand icons as SVG components with official colors

export const GmailIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
  </svg>
);

export const GoogleDocsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M14.727 6.727H9.273v1.091h5.454V6.727zm0 2.182H9.273v1.091h5.454V8.909zm-2.182 2.182H9.273v1.091h3.272v-1.091zM6 2C4.895 2 4 2.895 4 4v16c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V8l-6-6H6zm12 18H6V4h7v5h5v11z" fill="#4285F4"/>
  </svg>
);

export const GoogleDriveIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M7.71 3.5L1.15 15h4.55l2.9-5.39L7.71 3.5z" fill="#0F9D58"/>
    <path d="M15.75 10L12.3 3.5h5.4L21.15 10h-5.4z" fill="#FFAB00"/>
    <path d="M8.5 12l-2.9 5.5h11.8L20.3 12H8.5z" fill="#4285F4"/>
  </svg>
);

// Standard Google action set for team dashboards
export const createGoogleActions = () => [
  {
    link: "https://mail.google.com",
    iconComponent: GmailIcon,
    title: "Access Gmail",
    description: "View team communications and updates",
    external: true
  },
  {
    link: "https://docs.google.com",
    iconComponent: GoogleDocsIcon,
    title: "Access Docs",
    description: "Create and edit team documentation",
    external: true
  },
  {
    link: "https://drive.google.com",
    iconComponent: GoogleDriveIcon,
    title: "Access Drive",
    description: "Access shared files and resources",
    external: true
  }
];