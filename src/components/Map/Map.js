import testPoints from '../../data/test'

//in ms
const INTERVAL = 1000;

export default {
  name: 'Map',
  components: {},
  props: [],
  data () {
    return {
      map: Object
    }
  },
  created (){

    var self = this;
    ymaps.ready(init);

    function init () {
      self.map = new ymaps.Map('map', {
        center: [55.76, 37.64], // Москва
        zoom: 10
      });

      self.testMovement();
    }
  },
  methods: {
    testMovement(){

      let self = this,
        points = testPoints,
        curIdx = 0,
        curPoint = points[curIdx];

      let mark = new ymaps.Placemark(curPoint, {}, {
        preset: 'islands#circleIcon',
        iconColor: '#3caa3c'
      });

      self.map.geoObjects.add(mark);
      self.map.setCenter(curPoint, 14);

      let timer = setInterval(function(){
          if(curIdx === (points.length - 1)){
            clearTimeout(timer);
          }
          else{
            curIdx++;
            curPoint = points[curIdx];

            mark.geometry.setCoordinates(curPoint);
            self.map.setCenter(curPoint, 14);
          }

        }, INTERVAL);
    }
  }
}
