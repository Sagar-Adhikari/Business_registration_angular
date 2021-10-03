// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  icon_image_path: 'http://localhost:4000/',
  GITHUB_GRAPHQL_API_ENDPOINT: 'https://api.github.com/graphql',
  googleMapKey: 'AIzaSyBxK3ZJyPztyTFAvQrOARGPi_0HAUb-d0c',
  googleMapApi: 'AIzaSyAohawGd_pdG2YvgLE9rbBVbUUoXpnExzU',
  HOST: 'localhost',
  PORT: 4000,
  WS_PATH: '/subscriptions',
  GRAPHQL_PATH: '/graphql'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
