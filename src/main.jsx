import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';

import './index.css';

import App from './App.jsx';
import NotFound from './pages/notFound.jsx';
import Login from './pages/login.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound />,
    },
    {
        path: "/login",
        element: <Login />,
    }
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
