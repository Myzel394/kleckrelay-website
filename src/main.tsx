import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import RootRoute from "~/routes/Root";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootRoute />,
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
