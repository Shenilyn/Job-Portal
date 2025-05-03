import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Home from "./Home"; 
import NotFound from "./NotFound";
import Dashboard from "./Dashboard";
import LearningPath from "./LearningPath";
import Settings from "./Settings";
import Resume from "./Resume";
import JobMatches from "./JobMatches";
import './App.css';
import About from "./About";
import Privacy from "./privacy"; 
import VerifyEmail from "./verifyEmail"; // Import the verification page

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Default route
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verifyEmail", // Add this route for email verification
    element: <VerifyEmail />,
  },
  {
    path: "*",
    element: <NotFound />, 
  },
  {
    path: "/learning-path",
    element: <LearningPath />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  }, 
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/resume",
    element: <Resume />,
  },
  {
    path: "/job-matches",
    element: <JobMatches />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/privacy",
    element: <Privacy />, // Route for the Privacy Policy page
  },
  
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
