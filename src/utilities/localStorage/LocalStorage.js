const CURRENT_ORDER_KEY = 'current_order';

export default class LocalStorage {
  static getCurrentOrder() {
    let currentOrder = LocalStorage._get(CURRENT_ORDER_KEY);
    if (currentOrder) {
      try {
        currentOrder = JSON.parse(currentOrder);
        return currentOrder;
      } catch (e) {
        LocalStorage._remove(CURRENT_ORDER_KEY);
      }
    }
    return null;
  }

  static setCurrentOrder(order) {
    LocalStorage._set(CURRENT_ORDER_KEY, JSON.stringify(order));
  }

  static _get(key) {
    return localStorage.getItem(key);
  }

  static _set(key, value) {
    return localStorage.setItem(key, value);
  }

  static _remove(key) {
    return localStorage.removeItem(key);
  }
}
