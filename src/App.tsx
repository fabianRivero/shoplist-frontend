import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./auth/context"
import { AppRouter } from "./routes/AppRouter"
import { ModalProvider } from "./shared/components/modal/context"
import "./app.scss"

function App() {

  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ModalProvider>
    </AuthProvider>
  )
}

export default App
