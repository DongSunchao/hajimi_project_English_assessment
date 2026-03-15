/**
 * Application Routes Configuration
 * 
 * This file defines all the routes for the speech practice application.
 * Using React Router v6 with createBrowserRouter for client-side routing.
 */

import { createBrowserRouter } from "react-router";
import AssessmentPage from "./AssessmentPage";
import HistoryPage from "./HistoryPage";
import { PracticePageWrapper } from "./PracticePageWrapper";
import StatisticsPage from "./StatisticsPage";
import WelcomePage from "./WelcomePage";

/**
 * Router configuration with main routes:
 * - "/" - Welcome/Landing page
 * - "/practice" - Voice recording and practice page (legacy from original design)
 * - "/assessment" - New voice recording and assessment page (GitHub functionality)
 * - "/statistics" - Phoneme statistics with periodic table layout
 * - "/history" - Assessment history records
 */
export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <WelcomePage /> },
      { path: "practice", element: <AssessmentPage /> }, // Updated to use Assessment page
      { path: "assessment", element: <AssessmentPage /> },
      { path: "statistics", element: <StatisticsPage /> },
      { path: "history", element: <HistoryPage /> },
    ],
  },
]);