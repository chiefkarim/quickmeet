import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Meet from './pages/Meet.tsx'
import Index from './pages/Index.tsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<Index/>
  },
  {
    path:"/meet",
    element:<Meet/>
  }
]) 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
