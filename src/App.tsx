import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./auth/context"
import { AppRouter } from "./routes/AppRouter"


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
