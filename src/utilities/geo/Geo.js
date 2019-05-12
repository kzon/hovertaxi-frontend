import geolib from 'geolib';

export default class Geo {
  static moveTo(start, distance, bearing) {
    return Geo._positionFromObject(
      geolib.computeDestinationPoint(Geo._positionToObject(start), distance, bearing)
    );
  }

  static kilometerPerHourToMeterPerSecond(kilometerPerSecond) {
    return kilometerPerSecond / 3.6;
  }

  static _positionToObject(position) {
    return {latitude: position[0], longitude: position[1]};
  }

  static _positionFromObject(position) {
    return [position.latitude, position.longitude];
  }
}
