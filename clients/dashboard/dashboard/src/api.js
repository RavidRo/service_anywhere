const axios = require("axios");
const config = require("./config.json");

const host = config.host;
const port = config.port;

const host_port = `${host}:${port}`;
const base_route = `${host}`;

export function getOrders() {
  console.log("Getting orders");
  const url = `${base_route}getOrders`;
  return axios({
    method: "GET",
    url: url,
  })
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        console.log("Error in getting orders");
      }
    })
    .catch((err) => {
      alert(`failed to get orders due to ${err}`);
      return [];
    });
}

export function getWaiters() {
  const url = `${base_route}getWaiters`;
  return axios({
    method: "GET",
    url: url,
  })
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        console.log("Error in getting waiters");
      }
    })
    .catch((err) => alert(`failed to get waiters due to ${err}`));
}

export function assignWaiter(orderId, waiterId) {
  const url = `${base_route}assignWaiter`;
  return axios({
    method: "POST",
    url: url,
    data: JSON.stringify({
      orderID: orderId,
      waiterID: waiterId,
    }),
  })
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        console.log("Error in assign waiter");
      }
    })
    .catch((err) => alert(`failed to assign waiter due to ${err}`));
}

export function getWaiterByOrder(orderId) {
  const url = `${base_route}getWaiterByOrder`;
  return axios({
    method: "POST",
    url: url,
    data: JSON.stringify({
      orderID: orderId,
    }),
  })
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        console.log("Error in get waiter by order");
      }
    })
    .catch((err) => console.log(`failed to assign waiter due to ${err}`));
}
