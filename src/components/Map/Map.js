import testPoints from '../../data/test'
import aircraftRequests from '../../utilities/requests/aircraftRequests'

//in ms
const INTERVAL = 1000;
const presetForAircraft = {
  preset: 'islands#circleIcon',
  iconColor: '#3caa3c'
};

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

      self.demoAircrafts();
      self.testMovement();
    }
  },
  methods: {
    testMovement(){

      let self = this,
        points = testPoints,
        curIdx = 0,
        curPoint = points[curIdx];

      let mark = new ymaps.Placemark(curPoint, {}, presetForAircraft);

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
    },
    createGeoObjectFromAircraft(aircraft){
      return new ymaps.GeoObject({
        geometry: {
          type: "Points",
          coordinates: aircraft.position
        },
        properties: {
          id: aircraft.id
        }
      }, {
        // options
        preset: 'islands#circleIcon',
        iconColor: '#3caa3c',
        //user can't move this object
        draggable: false
      });
    },
    async demoAircrafts() {
      try {
        let self = this,
          center = [55.76, 37.64], radius = 20000;

        let aircrafts = await aircraftRequests.loadInCircle(center, radius);
        let geoCollection = new ymaps.GeoObjectCollection(null, presetForAircraft);

        aircrafts.forEach(aircraft => {
          let geoObject = self.createGeoObjectFromAircraft(aircraft);
          geoCollection.add(geoObject);
        });

        self.map.geoObjects.add(geoCollection);
        //set auto center and zoom, cause all marks should be visible on map
        self.map.geoObjects.setBounds(geoCollection.getBounds());

        let timer = setInterval(async function(){
          let iterator = geoCollection.getIterator(), object;
          while ((object = iterator.getNext()) !== iterator.STOP_ITERATION) {
            let aircraft = aircrafts.find(a => a.id === object.properties.get("id"));
            object.geometry.setCoordinates(aircraft.position());
          }

          aircrafts = await aircraftRequests.loadInCircle(center, radius);

        }, INTERVAL);

      } catch (error) {
        console.error(error);
      }
    }
  }
}
