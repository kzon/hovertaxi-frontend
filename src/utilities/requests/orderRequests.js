import Http from './base.js';

export default class {

  static preOrder(from, to, aircraftClass){
    return Http.fetchPost('/api/order/preOrder', {
      from_pad_id: from,
      to_pad_id: to,
      aircraft_class_id: aircraftClass
    });
  }

  static createOrder(from, to, aircraftClass){
    return Http.fetchPost('/api/order/createOrder', {
      from_pad_id: from,
      to_pad_id: to,
      aircraft_class_id: aircraftClass
    });
  }

  static getOrderInfo(){
    return Http.fetchGet('/api/order/getOrderInfo');
  }

  static cancelOrder(){
    return Http.fetchPost('/api/order/cancelOrder', {});
  }

}
