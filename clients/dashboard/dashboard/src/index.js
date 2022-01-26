import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import OrdersViewController from "./viewController/OrdersViewController";
import OrdersViewModel from "./viewModel/ordersViewModel";
import WaitersViewModel from "./viewModel/waitersViewModel";

const ordersViewModel = new OrdersViewModel();
const waitersViewModel = new WaitersViewModel();

ReactDOM.render(
  <React.StrictMode>
    <OrdersViewController
      ordersViewModel={ordersViewModel}
      waitersViewModel={waitersViewModel}
    />
  </React.StrictMode>,
  document.getElementById("root")
);
