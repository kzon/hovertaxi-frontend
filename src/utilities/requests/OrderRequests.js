import HTTP from './HTTP.js';

export default class OrderRequests {

  static getPreOrderInfo(from, to, aircraftClass) {
    return HTTP.fetchPost('/api/order/getPreOrderInfo', {
      from_pad_id: from,
      to_pad_id: to,
      aircraft_class_id: aircraftClass,
    }).then(preOrder => OrderRequests._preparePreOrder(preOrder));
  }

  static createOrder(from, to, aircraftClass) {
    return HTTP.fetchPost('/api/order/createOrder', {
      from_pad_id: from,
      to_pad_id: to,
      aircraft_class_id: aircraftClass,
    });
  }

  static loadCurrentOrder() {
    return HTTP.fetchGet('/api/order/loadCurrentOrder')
      .then(order => OrderRequests._prepareOrder(order));
  }

  static cancelOrder() {
    return HTTP.fetchPost('/api/order/cancelOrder', {});
  }

  static _preparePreOrder(preOrder) {
    preOrder.price = JSON.parse(preOrder.price);
    preOrder.route = JSON.parse(preOrder.route);
    preOrder.route.points = JSON.parse(preOrder.route.points);
    preOrder.route.time = JSON.parse(preOrder.route.time);
    preOrder.route.altitude = JSON.parse(preOrder.route.altitude);
    return preOrder;
  }

  static _prepareOrder(order) {
    order.price = JSON.parse(order.price);
    order.route = JSON.parse(order.route);
    order.route.points = JSON.parse(order.route.points);
    order.route.time = JSON.parse(order.route.time);
    return order;
  }

}
