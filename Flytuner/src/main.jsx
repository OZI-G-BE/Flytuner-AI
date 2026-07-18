import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
// import App from './App.jsx'
import './index.css'
import PdfSummary from './components/pdfSummary/pdfSummary.jsx'
// import Login from './components/login/login.jsx'
import ErrorPage from './components/errorPage/errorPage.jsx'
import FileSelectCheckBox from './components/fileSelectCheckBox/fileSelectCheckBox.jsx'
import QuizQnA from './components/quizQnA/quizQnA.jsx'
import HomePage from './components/homePage/homePage.jsx'
import ApiKeyFeild from './components/apiKeyFeild/apiKeyFeild.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    // element:   <Login />,
    element: <HomePage/>,
    errorElement: <ErrorPage/>
  },

 {
    path: '/apiKeyFeild',
    element: <ApiKeyFeild/>,
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
  },
  {
    path: '/quest',
    element: <QuizQnA/>,
    errorElement:<ErrorPage/>
  },
  {
    path: '/home',
    element: <HomePage/>,
    errorElement:<ErrorPage/>
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  
  </StrictMode>,
)
