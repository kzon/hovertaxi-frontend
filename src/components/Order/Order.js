import {eventBus, EVENT_AIRCRAFT_PAD_SELECTED} from '../../utilities/event/event'
import orderRequests from '../../utilities/requests/orderRequests'

export default {
  name: 'order',
  components: {},
  props: [],

  data() {
    return {
      from_pad: null,
      to_pad: null,
      aircraft_class: {id: 3},
    }
  },

  computed: {},

  created() {
    eventBus.$on(EVENT_AIRCRAFT_PAD_SELECTED, pad => {
      if (this.from_pad === null)
        this.from_pad = pad;
      else
        this.to_pad = pad;
    });
  },

  mounted() {},

  methods: {
    order: () => {
      orderRequests.createOrder(this.from_pad.id, this.to_pad.id, this.aircraft_class.id);
    }
  }
}
