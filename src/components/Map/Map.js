import AircraftRequests from '../../utilities/requests/AircraftRequests'
import Geo from '../../utilities/geo/Geo'
import * as event from '../../utilities/event/event'

const AIRCRAFT_RELOAD_INTERVAL = 7000;
const AIRCRAFT_RENDER_INTERVAL = 1000;

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
      self.loadPads();
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
      }, {
        suppressMapOpenBlock: true,
      })
    },

    makeAircraftPlacemark(aircraft) {
      return new ymaps.Placemark(aircraft.position, {}, {
        iconLayout: ymaps.templateLayoutFactory.createClass(
          '<div class="aircraft-placemark" style="transform: rotate({{options.rotate}}deg);">' +
          '{% include "default#image" %}' +
          '</div>'),
        iconImageHref: 'assets/helicopter.png',
        iconImageSize: [20, 20],
        iconRotate: aircraft.direction,
      });
    },

    makePadPlacemark(pad) {
      return new ymaps.Placemark(pad.position, {}, {
        iconLayout: ymaps.templateLayoutFactory.createClass(
          '<span class="pad-placemark">' +
          '{{options.name}}' +
          '</span>'),
        iconName: pad.name,
        iconShape: {
          type: 'Circle',
          coordinates: [0, 0],
          radius: 20,
        },
      });
    },

    async loadAircrafts() {
      try {
        const center = [55.76, 37.64], radius = 20000;
        const aircraftsOnMap = new ymaps.GeoObjectCollection();
        const loadedAircrafts = await AircraftRequests.loadInCircle(center, radius);
        loadedAircrafts.forEach(aircraft => {
          const geoObject = this.makeAircraftPlacemark(aircraft);
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

    async loadPads() {
      const self = this, position = [55.750512, 37.539209];
      const pads = await AircraftRequests.loadNearestPads(position);
      const padsOnMap = new ymaps.GeoObjectCollection();
      pads.forEach(function (pad) {
        try {
          const placemark = self.makePadPlacemark(pad);
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
