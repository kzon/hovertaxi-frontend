import {eventBus, EVENT_AIRCRAFT_PAD_SELECTED, EVENT_PRE_ORDER_INFO_LOADED} from '../../utilities/event/event'
import orderRequests from '../../utilities/requests/orderRequests'
import aircraftRequests from '../../utilities/requests/aircraftRequests'
import Icon from '../Icon/index'

export default {
  name: 'order',
  components: {Icon},
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
        this.preOrderInfo = await orderRequests.getPreOrderInfo(
          this.selectedFromPad.id, this.selectedToPad.id, this.selectedAircraftClass.id
        );
        eventBus.$emit(EVENT_PRE_ORDER_INFO_LOADED, this.preOrderInfo);
      }
    }
  },

  async mounted() {
    eventBus.$on(EVENT_AIRCRAFT_PAD_SELECTED, pad => {
      if (this.selectedFromPad === null)
        this.selectedFromPad = pad;
      else
        this.selectedToPad = pad;
    });

    this.aircraftClasses = await aircraftRequests.loadAircraftClasses();
  },

  methods: {
    order: function () {
      orderRequests.createOrder(this.selectedFromPad.id, this.selectedToPad.id, this.selectedAircraftClass.id);
    },

    setAircraftClass: function (aircraftClass) {
      this.selectedAircraftClass = aircraftClass;
    }
  }
}
