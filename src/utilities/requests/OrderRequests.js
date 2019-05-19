import HTTP from './HTTP.js';
import AircraftRequests from "./AircraftRequests"

export default class OrderRequests {

  static getPreOrderInfo(from, to, aircraftClass) {
    return HTTP.fetchPost('/api/order/getPreOrderInfo', {
      from_pad_id: from,
      to_pad_id: to,
      aircraft_class_id: aircraftClass,
    }).then(preOrder => OrderRequests.preparePreOrder(preOrder));
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
      .then(order => OrderRequests.prepareOrder(order));
  }

  static cancelOrder() {
    return HTTP.fetchPost('/api/order/cancelOrder', {});
  }

  static preparePreOrder(preOrder) {
    if (preOrder === null)
      return null;
    preOrder.price = JSON.parse(preOrder.price);
    preOrder.route = JSON.parse(preOrder.route);
    preOrder.route.points = JSON.parse(preOrder.route.points);
    preOrder.route.time = JSON.parse(preOrder.route.time);
    preOrder.route.altitude = JSON.parse(preOrder.route.altitude);
    return preOrder;
  }

  static prepareOrder(order) {
    if (order === null)
      return null;
    order.price = JSON.parse(order.price);
    order.route = JSON.parse(order.route);
    order.route = OrderRequests.prepareRoute(order.route);
    order.aircraft_class = JSON.parse(order.aircraft_class);
    order.assigned_aircraft = JSON.parse(order.assigned_aircraft);
    order.assigned_aircraft = AircraftRequests.prepareAircraft(order.assigned_aircraft);
    order.assigned_aircraft_model = JSON.parse(order.assigned_aircraft_model);
    order.time_to_arrival = JSON.parse(order.time_to_arrival);
    return order;
  }

  static prepareRoute(route) {
    if (route === null)
      return null;
    route.points = JSON.parse(route.points);
    route.time = JSON.parse(route.time);
    return route;
  }

}
