const CURRENT_ORDER_KEY = 'current_order';

export default class LocalStorage {
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
