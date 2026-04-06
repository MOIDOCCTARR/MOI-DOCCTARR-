import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { StartAssessmentPage } from "./pages/StartAssessmentPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/assessment/start",
    element: <StartAssessmentPage />,
  },
]);
