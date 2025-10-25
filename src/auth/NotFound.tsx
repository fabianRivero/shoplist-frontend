import { useNavigate } from "react-router-dom";
import "./not-found.scss";

export const NotFound = () => {
  const navigate = useNavigate()
  const goToMain = () => navigate("/main-menu")

  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <button onClick={goToMain}>Volver al inicio</button>
    </div>
  );
};
