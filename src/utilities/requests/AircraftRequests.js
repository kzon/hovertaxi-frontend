import HTTP from './HTTP.js';

export default class AircraftRequests {

  static loadInCircle(center, radius) {
    return HTTP.fetchPost('/api/aircraft/loadInCircle', {
      center: center,
      radius: radius,
    }).then(aircrafts => AircraftRequests._prepareAircrafts(aircrafts));
  }

  static loadCurrentOrderAircraft() {
    return HTTP.fetchGet('/api/aircraft/loadCurrentOrderAircraft');
  }

  static loadAircraftClasses() {
    return HTTP.fetchGet('/api/aircraft/loadAircraftClasses');
  }

  static loadNearestPads(position) {
    return HTTP.fetchPost('/api/aircraft/loadNearestPads', {
      position: position
    }).then(pads => AircraftRequests._preparePads(pads));
  }

  static _prepareAircrafts(aircrafts) {
    for (let aircraft of aircrafts) {
      aircraft.position = JSON.parse(aircraft.position);
      aircraft.direction = JSON.parse(aircraft.direction);
      aircraft.speed = JSON.parse(aircraft.speed);
      aircraft.is_assigned = JSON.parse(aircraft.is_assigned);
    }
    return aircrafts;
  }

  static _preparePads(pads) {
    for (let pad of pads) {
      pad.position = JSON.parse(pad.position);
    }
    return pads;
  }

}
