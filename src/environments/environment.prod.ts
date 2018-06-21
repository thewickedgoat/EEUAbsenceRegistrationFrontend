export const environment = {
  production: true,
  apiEndPoint: 'http://eeudatabase20180621115928.azurewebsites.net/api/', //'http://localhost:51017/api/',
  jwt () {
    const token = sessionStorage.getItem('token');
    if(token != null && token.length > 0) {
      return token.slice(1, -1);
    }
  }
};
