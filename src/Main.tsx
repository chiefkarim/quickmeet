import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Meet from "./pages/Meet.tsx";
import Index from "./pages/Index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth/google",
    element: <Index />,
  },
  {
    path: "/meet/:id",
    element: <Meet />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
