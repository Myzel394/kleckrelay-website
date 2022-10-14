import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootRoute from "~/routes/Root";
import React, {ReactElement} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "~/constants/react-query";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootRoute />,
    },
]);


export default function App(): ReactElement {
    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </React.StrictMode>
    )
}

