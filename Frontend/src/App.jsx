import "./style.scss"
import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { AuthProvider } from "./features/auth/auth.provider.jsx"
import { InterviewProvider } from "./features/Interview/interview.provider.jsx"
function App() {
  return (
    <AuthProvider>
        <InterviewProvider>
            <RouterProvider router={router}/>
        </InterviewProvider>
     </AuthProvider>
  )
}

export default App
