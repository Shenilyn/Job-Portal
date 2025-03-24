import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./Login";
import Signup from "./SignUp";
import Home from "./Home"; // Create this component if not present
import NotFound from "./NotFound"; // Create this component
import Dashboard from "./Dashboard";
import RecommendedJobs from "./RecommendedJobs";
import './App.css';

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
    path: "*",
    element: <NotFound />, // Catch-all route for 404 errors
  },
  {
    path: "recommended-jobs",
    element: <RecommendedJobs />, // Catch-all route for 404 errors
  },
  {
    path: "/dashboard",
    element: <Dashboard/>
  }
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
