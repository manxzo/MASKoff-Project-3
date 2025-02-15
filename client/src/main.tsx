import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import { UserConfigProvider } from "./config/UserConfig.tsx";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserConfigProvider>
        <Provider>
          <App />
        </Provider>
      </UserConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
