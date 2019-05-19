import Vue from "vue"

export const eventBus = new Vue();

export const EVENT_AIRCRAFT_PAD_SELECTED = 'pad_selected';
export const EVENT_PRE_ORDER_INFO_LOADED = 'pre_order_info_loaded';
export const EVENT_ORDER_CREATED = 'order_created';
export const EVENT_AIRCRAFT_ASSIGNED = 'aircraft_assigned';
