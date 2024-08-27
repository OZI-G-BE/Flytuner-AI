import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import PdfSummary from './components/pdfSummary/pdfSummary.jsx'
import Login from './components/login/login.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element:   <Login />
  },
  {
    path: '/upload',
    element: <PdfSummary/>
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  
  </StrictMode>,
)
