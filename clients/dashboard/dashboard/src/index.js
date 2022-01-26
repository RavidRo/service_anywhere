import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import OrdersViewController from "./viewController/OrdersViewController";

ReactDOM.render(
  <React.StrictMode>
    <OrdersViewController />
  </React.StrictMode>,
  document.getElementById("root")
);
