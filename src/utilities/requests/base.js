'use strict';

const baseUrl = 'http://localhost:8888';

class Http {

  static fetchGet(path){
    const url = baseUrl + path;

    return fetch(url,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
      })
      .then(function(response){
        if(response.status >= 400) throw response;

        return response.json();
      });
  }

  static fetchPost(path, body){
    const url = baseUrl + path;

    return fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(body),
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(function(response){
      if(response.status >= 400) throw response;

      return response.json();
    });
  }
}

export default Http;
