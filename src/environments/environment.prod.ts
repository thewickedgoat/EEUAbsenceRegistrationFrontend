export const environment = {
  production: true,
  apiEndPoint: 'http://localhost:51017/api/', //https://xn--eeufravrdatabase-0ob.azurewebsites.net/api/
  tokenEndpoint: 'http://localhost:51017/token', //https://xn--eeufravrdatabase-0ob.azurewebsites.net/token
  jwt () {
    const token = sessionStorage.getItem('token');
    if(token != null && token.length > 0) {
      return token.slice(1, -1);
    }
  }
};
