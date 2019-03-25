export default {
  name: 'Map',
  components: {},
  props: [],
  data () {
    return {

    }
  },
  created (){
    var myMap;
    ymaps.ready(init);

    function init () {
      myMap = new ymaps.Map('map', {
        center: [55.76, 37.64], // Москва
        zoom: 10
      });

    }
  },
  methods: {

  }
}
