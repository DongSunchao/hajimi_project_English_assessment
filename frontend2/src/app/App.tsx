/**
 * App Component - Main Application Entry Point
 * 
 * This is the root component of the application.
 * It sets up the React Router with the configured routes.
 * 
 * Routing:
 * - Uses React Router v6's RouterProvider
 * - Routes are defined in ./routes.tsx
 * - Single-page application (SPA) with client-side routing
 * 
 * Pages:
 * - "/" - WelcomePage (landing page)
 * - "/practice" - PracticePageWrapper (voice recording)
 * - "/statistics" - StatisticsPage (phoneme statistics)
 */

import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}
