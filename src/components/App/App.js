import Map from '../Map/index'
import OrderForm from '../OrderForm/index'
import CurrentOrder from '../CurrentOrder/index'
import * as event from '../../utilities/event/event'
import IconsRenderer from '../../utilities/icons/IconsRenderer'
import LocalStorage from '../../utilities/localStorage/LocalStorage'

export default {
  name: 'App',
  components: {
    OrderForm,
    CurrentOrder,
    Map,
  },

  data() {
    return {
      currentOrder: null,
    };
  },

  created() {
    IconsRenderer.renderSprite();
  },

  mounted() {
    this.currentOrder = LocalStorage.getCurrentOrder();
    event.eventBus.$on(event.EVENT_ORDER_CREATED, order => {
      this.currentOrder = order;
      LocalStorage.setCurrentOrder(order);
    });
  },
}
