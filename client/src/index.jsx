import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Asegúrate de importar el componente App
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./services/AuthProvider";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals(); // Opcional, para medir el rendimiento
