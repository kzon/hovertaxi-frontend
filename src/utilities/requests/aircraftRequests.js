import Http from './base.js';

export default class {

  static loadInCircle(center, radius){
    return Http.fetchPost('/api/aircraft/loadInCircle',{
      center: center,
      radius: radius
    })
  }

  static loadCurrentOrderAircraft(){
    return Http.fetchGet('/api/aircraft/loadCurrentOrderAircraft');
  }

  static loadAircraftClasses(){
    return Http.fetchGet('/api/aircraft/loadAircraftClasses');
  }

  static loadNearestPads(position){
    return Http.fetchPost('/api/aircraft/loadNearestPads', {
      position: position
    });
  }

}
