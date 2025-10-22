import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./auth/context"
import { AppRouter } from "./routes/AppRouter"
import { ModalProvider } from "./shared/components/modal/context"
import { HeaderModalProvider } from "./shared/components/headerModal/context"
import "./app.scss"

function App() {

  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <HeaderModalProvider>
            <AppRouter />
          </HeaderModalProvider>
        </BrowserRouter>
      </ModalProvider>
    </AuthProvider>
  )
}

export default App
