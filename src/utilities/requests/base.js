'use strict';

const baseUrl = 'http://localhost:8888';

class Http {

  static fetchGet(path){
    const url = baseUrl + path;

    return fetch(url,
      {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
      })
      .then(function(response){
        if(response.status >= 400) throw response;

        return response.json();
      });
  }

  static fetchPost(path, body){
    const url = baseUrl + path;

    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
    .then(function(response){
      if(response.status >= 400) throw response;

      return response.json();
    });
  }
}

export default Http;