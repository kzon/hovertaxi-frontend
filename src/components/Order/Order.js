import {eventBus, EVENT_AIRCRAFT_PAD_SELECTED} from '../../utilities/event/event'
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
    }
  },

  computed: {
    preOrderInfo: function () {
      if (!this.orderFieldsFilled)
        return null;

      return {
        "route": {
          "points": [
            [
              58.1243,
              32.42134
            ],
            [
              58.1243,
              32.42134
            ],
            [
              58.1243,
              32.42134
            ]
          ],
          "time": 8
        },
        "price": 755
      };
    },

    orderFieldsFilled: function () {
      return this.selectedFromPad !== null && this.selectedToPad !== null && this.selectedAircraftClass !== null;
    },
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
