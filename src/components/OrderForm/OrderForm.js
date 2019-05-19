import * as event from '../../utilities/event/event'
import OrderRequests from '../../utilities/requests/OrderRequests'
import aircraftRequests from '../../utilities/requests/AircraftRequests'
import Icon from '../Icon/index'
import OrderInfo from '../OrderInfo/index'

export default {
  name: 'OrderForm',
  components: {
    Icon,
    OrderInfo,
  },
  props: [],

  data() {
    return {
      selectedFromPad: null,
      selectedToPad: null,
      selectedAircraftClass: null,
      aircraftClasses: [],
      preOrderInfo: null,
    }
  },

  computed: {
    orderFieldsFilled: function () {
      return this.selectedFromPad && this.selectedToPad && this.selectedAircraftClass;
    },
  },

  watch: {
    orderFieldsFilled: async function () {
      if (this.orderFieldsFilled) {
        this.preOrderInfo = await OrderRequests.getPreOrderInfo(
          this.selectedFromPad.id, this.selectedToPad.id, this.selectedAircraftClass.id
        );
        event.eventBus.$emit(event.EVENT_PRE_ORDER_INFO_LOADED, this.preOrderInfo);
      }
    }
  },

  async mounted() {
    event.eventBus.$on(event.EVENT_AIRCRAFT_PAD_SELECTED, pad => {
      if (this.selectedFromPad === null)
        this.selectedFromPad = pad;
      else if (this.selectedFromPad.id !== pad.id)
        this.selectedToPad = pad;
    });

    this.aircraftClasses = await aircraftRequests.loadAircraftClasses();
  },

  methods: {
    createOrder: async function () {
      const order = await OrderRequests.createOrder(this.selectedFromPad.id, this.selectedToPad.id, this.selectedAircraftClass.id);
      if (order) {
        event.eventBus.$emit(event.EVENT_ORDER_CREATED, order);
      } else {
        alert('Не удалось создать заказ');
      }
    },
  }
}
