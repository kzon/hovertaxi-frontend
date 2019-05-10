import map from '../Map/Map'

export default {
  name: 'order',
  components: {},
  props: [],

  data() {
    return {
      from_pad_id: map.from_pad_id,
      to_pad_id: map.to_pad_id,
      aircraft_class: '',
    }
  },

  computed: {},

  mounted() {

  },
  methods: {}
}
