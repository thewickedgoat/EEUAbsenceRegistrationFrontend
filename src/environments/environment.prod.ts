export const environment = {
  production: true,
  apiEndPoint: 'https://xn--eeufravrdatabase-0ob.azurewebsites.net/api/', //https://xn--eeufravrdatabase-0ob.azurewebsites.net/api/
  tokenEndpoint: 'https://xn--eeufravrdatabase-0ob.azurewebsites.net', //https://xn--eeufravrdatabase-0ob.azurewebsites.net
  jwt () {
    const token = sessionStorage.getItem('token');
    if(token != null && token.length > 0) {
      return token.slice(1, -1);
    }
  }
};
