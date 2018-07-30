// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

  export const environment = {
    production: false,
    apiEndPoint: 'http://localhost:51017/api/', //'https://eeudatabase20180621115928.azurewebsites.net/api/',
    tokenEndpoint: 'http://localhost:51017/token',
    jwt () {
        const token = sessionStorage.getItem('token');
        if(token != null && token.length > 0) {
          return token.slice(1, -1);
      }
    }
  };
