import Map from '../Map/index'
import OrderForm from '../OrderForm/index'
import CurrentOrder from '../CurrentOrder/index'
import * as event from '../../utilities/event/event'
import IconsRenderer from '../../utilities/icons/IconsRenderer'
import LocalStorage from '../../utilities/localStorage/LocalStorage'
import OrderRequests from '../../utilities/requests/OrderRequests'

const UPDATE_ORDER_INTERVAL = 3000;

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

  async mounted() {
    this.currentOrder = await OrderRequests.loadCurrentOrder();
    event.eventBus.$on(event.EVENT_ORDER_CREATED, order => {
      this.setCurrentOrder(order);
    });
    setInterval(this.updateCurrentOrder, UPDATE_ORDER_INTERVAL);
  },

  methods: {
    async updateCurrentOrder() {
      const order = await OrderRequests.loadCurrentOrder();
      if (order !== null)
        this.currentOrder = order;
    },
  },
}
