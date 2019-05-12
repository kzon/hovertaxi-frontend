import HTTP from './HTTP.js';

export default class OrderRequests {

  static getPreOrderInfo(from, to, aircraftClass) {
    return HTTP.fetchPost('/api/order/getPreOrderInfo', {
      from_pad_id: from,
      to_pad_id: to,
      aircraft_class_id: aircraftClass,
    });
  }

  static createOrder(from, to, aircraftClass) {
    return HTTP.fetchPost('/api/order/createOrder', {
      from_pad_id: from,
      to_pad_id: to,
      aircraft_class_id: aircraftClass,
    });
  }

  static loadCurrentOrder() {
    return HTTP.fetchGet('/api/order/loadCurrentOrder');
  }

  static cancelOrder() {
    return HTTP.fetchPost('/api/order/cancelOrder', {});
  }

}
