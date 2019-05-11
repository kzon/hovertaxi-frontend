import routes from '../../data/demo'
import aircraftRequests from '../../utilities/requests/aircraftRequests'
import {eventBus, EVENT_AIRCRAFT_PAD_SELECTED} from '../../utilities/event/event'

//in ms
const INTERVAL = 400;
const presetForAircraft = {
  preset: 'islands#circleIcon',
  iconColor: '#3caa3c'
};

const presetForPad = {
  preset: 'islands#circleDotIcon',
  iconColor: '#1339aa'
};

export default {
  name: 'Map',
  components: {},
  props: [],

  data() {
    return {
      map: Object,
    }
  },

  created() {
    var self = this;
    ymaps.ready(init);

    function init() {
      self.map = new ymaps.Map('map', {
        center: [55.76, 37.64], // Москва
        zoom: 12,
        controls: [],
      });

      // self.demoAircrafts();
      self.testRoutes();
      self.createPads();

    }
  },

  methods: {
    testRoutes() {
      try {
        let self = this;

        let geoCollection = new ymaps.GeoObjectCollection(null, presetForAircraft);

        routes.forEach(function (route, index) {
          let curIdx = 0;
          let geoObject = self.createGeoObject([route[curIdx][1], route[curIdx][0]], index);
          route.curIdx = curIdx;
          geoCollection.add(geoObject);
        });
        self.map.geoObjects.add(geoCollection);

        setInterval(function () {
          let iterator = geoCollection.getIterator(), object;
          while ((object = iterator.getNext()) !== iterator.STOP_ITERATION) {
            let route = routes[object.properties.get("id")];
            route.curIdx = route.curIdx + 1;
            let coords = route[route.curIdx];
            if (coords !== undefined) {
              let pos = [coords[1], coords[0]];
              object.geometry.setCoordinates(pos);
            }
          }

        }, INTERVAL);
      } catch (error) {
        console.log(error);
      }

    },

    createGeoObjectFromAircraft(aircraft) {
      let pts = JSON.parse(aircraft.position),
        position = [pts[0], pts[1]];
      console.log('position ', position);

      return this.createGeoObject(position, aircraft.id);
    },

    createGeoObject(position, id) {
      return new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: position
        },
        properties: {
          id: id
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

        setInterval(async function () {
          let iterator = geoCollection.getIterator(), object;
          while ((object = iterator.getNext()) !== iterator.STOP_ITERATION) {
            let aircraft = aircrafts.find(a => a.id === object.properties.get("id"));
            let pts = JSON.parse(aircraft.position), position = [pts[0], pts[1]];
            object.geometry.setCoordinates(position);
          }

          aircrafts = await aircraftRequests.loadInCircle(center, radius);

        }, INTERVAL);

      } catch (error) {
        console.error(error);
      }
    },

    async createPads() {
      let self = this, position = [55.750512, 37.539209];
      let pads = await aircraftRequests.loadNearestPads(position);
      let geoCollection = new ymaps.GeoObjectCollection(null, presetForPad);
      pads.forEach(function (pad) {
        try {
          let pts = JSON.parse(pad.position), pos = [pts[0], pts[1]];
          let geoObject = new ymaps.Placemark(pos, {
            hintContent: pad.name,
          }, presetForPad);
          geoObject.events.add('click', () => {
            eventBus.$emit(EVENT_AIRCRAFT_PAD_SELECTED, pad);
          });
          geoCollection.add(geoObject);
        } catch (err) {
          console.log(err);
        }
      });
      self.map.geoObjects.add(geoCollection);
    }
  }
}
