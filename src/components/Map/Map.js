import AircraftRequests from '../../utilities/requests/AircraftRequests'
import Geo from '../../utilities/geo/Geo'
import * as event from '../../utilities/event/event'

const AIRCRAFT_RELOAD_INTERVAL = 7000;
const AIRCRAFT_RENDER_INTERVAL = 1000;

const AIRCRAFT_POINT_STYLE = {
  preset: 'islands#circleIcon',
  iconColor: '#3caa3c'
};

const PAD_POINT_STYLE = {
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
      aircrafts: [],
    }
  },

  created() {
    const self = this;
    ymaps.ready(() => {
      self.map = self.makeMap();
      self.loadNearestPads();
      self.loadAircrafts();
      event.eventBus.$on(event.EVENT_PRE_ORDER_INFO_LOADED, preOrderInfo => {
        self.showRoute(preOrderInfo.route);
      });
    });
  },

  methods: {
    makeMap() {
      return new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 12,
        controls: [],
      })
    },

    createGeoObjectFromAircraft(aircraft) {
      return this.createPoint(aircraft.position, aircraft.id);
    },

    createPoint(position, id) {
      return new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: position
        },
        properties: {
          id: id
        }
      }, {
        preset: 'islands#circleIcon',
        iconColor: '#3caa3c',
        draggable: false
      });
    },

    async loadAircrafts() {
      try {
        const center = [55.76, 37.64], radius = 20000;
        const aircraftsOnMap = new ymaps.GeoObjectCollection(null, AIRCRAFT_POINT_STYLE);
        const loadedAircrafts = await AircraftRequests.loadInCircle(center, radius);
        loadedAircrafts.forEach(aircraft => {
          const geoObject = this.createGeoObjectFromAircraft(aircraft);
          aircraftsOnMap.add(geoObject);
          this.aircrafts.push({aircraft, geoObject});
        });
        this.map.geoObjects.add(aircraftsOnMap);

        setInterval(this.reloadAircrafts, AIRCRAFT_RELOAD_INTERVAL);
        setInterval(this.renderAircraftsPositions, AIRCRAFT_RENDER_INTERVAL);
      } catch (error) {
        console.error(error);
      }
    },

    async reloadAircrafts() {
      // aircrafts = await AircraftRequests.loadInCircle(center, radius);
    },

    renderAircraftsPositions() {
      for (let aircraft of this.aircrafts) {
        aircraft.aircraft.position = this.getNextAircraftPosition(aircraft.aircraft);
        aircraft.geoObject.geometry.setCoordinates(aircraft.aircraft.position);
      }
    },

    getNextAircraftPosition(aircraft) {
      const distance = Geo.kilometerPerHourToMeterPerSecond(aircraft.speed) * AIRCRAFT_RENDER_INTERVAL / 1000;
      return Geo.moveTo(aircraft.position, distance, aircraft.direction);
    },

    async loadNearestPads() {
      const self = this, position = [55.750512, 37.539209];
      const pads = await AircraftRequests.loadNearestPads(position);
      const padsOnMap = new ymaps.GeoObjectCollection(null, PAD_POINT_STYLE);
      pads.forEach(function (pad) {
        try {
          const position = JSON.parse(pad.position);
          const placemark = new ymaps.Placemark(position, {
            hintContent: pad.name,
          }, PAD_POINT_STYLE);
          placemark.events.add('click', () => {
            event.eventBus.$emit(event.EVENT_AIRCRAFT_PAD_SELECTED, pad);
          });
          padsOnMap.add(placemark);
        } catch (err) {
          console.log(err);
        }
      });
      self.map.geoObjects.add(padsOnMap);
    },

    showRoute(route) {
      if (this.routeLine)
        this.map.geoObjects.remove(this.routeLine);

      this.routeLine = new ymaps.Polyline(route.points, {
        hintContent: route.time + ' минут',
      }, {
        strokeColor: "#4292cc",
        strokeWidth: 4,
        strokeOpacity: 0.5
      });
      this.map.geoObjects.add(this.routeLine);
    }
  }
}
