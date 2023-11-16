import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Missing from './pages/Missing/Missing'
import RequireAuth from './components/RequireAuth/RequiteAuth'
import ListInvitation from './pages/ListInvitation/ListInvitation'

function App() {

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login/>
    },
   // {
      //element: <RequireAuth/>,
      //children: [
        {
          path: "/home/:idParams?",
          element: <Home/>
        },
        {
          path:"/listInvitation",
          element: <ListInvitation/>
        },
        {
          path: "*",
          element: <Missing/>
        }
      //]
    //}
   

  ])

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
