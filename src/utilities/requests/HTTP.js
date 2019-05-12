'use strict';

const baseUrl = '';

class HTTP {

  static fetchGet(path) {
    const url = baseUrl + path;

    return fetch(url,
      {
        method: "GET",
        credentials: "include",
      })
      .then(function (response) {
        if (response.status >= 400) throw response;

        return response.json();
      });
  }

  static fetchPost(path, body) {
    const url = baseUrl + path;

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
        if (response.status >= 400) throw response;

        return response.json();
      });
  }
}

export default HTTP;
