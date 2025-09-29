import React from "react";
import "./App.css";
import AppRoutes from "./routes";
import { Provider } from "react-redux";
import { store } from "./store/store";

//store config
function App() {
  return (
    <React.Fragment>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </React.Fragment>
  );
}

export default App;
