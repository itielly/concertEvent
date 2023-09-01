class ConnectionApi
{
  static sendRequest(url, method = "GET", params = null, callback = undefined) {

    const request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            switch (request.status) {
                case 401 : {
                    ConnectionServer.sessionExpired();
                    break;
                }
                case 200 : {
                    if (callback)
                        callback(JSON.parse(this.responseText));
                    break;
                }
                default : {
                    //ConnectionServer.sessionExpired();
                }
            }
        }
    };
    request.open(method, 'localhost' + url);
    request.send(ConnectionServer.prepareRequest(params, false));
  }
}