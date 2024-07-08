import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

// import rootReducer from "./reducer";
import { Toaster } from "react-hot-toast";
import { store } from "./reducer";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./reducer";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </Provider>
    </PersistGate>
  </React.StrictMode>
);
