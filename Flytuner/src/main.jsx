import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import PdfSummary from './components/pdfSummary/pdfSummary.jsx'
import Login from './components/login/login.jsx'
import ErrorPage from './components/errorPage/errorPage.jsx'
import FileSelectCheckBox from './components/fileSelectCheckBox/fileSelectCheckBox.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element:   <Login />,
    errorElement: <ErrorPage/>
  },
  {
    path: '/upload',
    element: <PdfSummary/>,
    errorElement: <ErrorPage/>
  },
  {
    path: '/chkbx',
    element: <FileSelectCheckBox/>,
    errorElement:<ErrorPage/>
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  
  </StrictMode>,
)
