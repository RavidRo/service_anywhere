import * as React from "react";
import AppBarView from "../view/AppBarView";
import Orders from "../components/orders";
import { assignWaiter, getWaitersByOrder, getOrders } from "../network/api";
import OrderViewController from "./OrderViewController";

function OrdersViewController() {
  const [orders, setOrders] = React.useState([]);
  React.useEffect(() => {
    let mounted = true;
    getOrders().then((orders) => {
      if (mounted) {
        setOrders(orders);
      }
    });
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <AppBarView />
      {orders.map((order, index) => (
        <OrderViewController order={order} key={index} />
      ))}
    </div>
  );
}

export default OrdersViewController;
