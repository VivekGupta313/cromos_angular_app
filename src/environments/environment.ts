// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:9999/api/',
  siteUrl: 'http://localhost:4200',
  // firebase: {
  //   apiKey: 'AIzaSyAiuqb4oYJNjagbIUUQ-REaaw2k44I1tiU',
  //   authDomain: 'cromos-a006f.firebaseapp.com',
  //   databaseURL: 'https://cromos-a006f.firebaseio.com',
  //   projectId: 'cromos-a006f',
  //   storageBucket: 'cromos-a006f.appspot.com',
  //   messagingSenderId: '593397602478',
  // },
  firebase: {
    apiKey: 'AIzaSyBbWlLYNTa-JvE3uG9j99vU7A343qFwucA',
    authDomain: 'chromos-cc861.firebaseapp.com',
    databaseURL: 'https://chromos-cc861.firebaseio.com',
    projectId: 'chromos-cc861',
    storageBucket: 'chromos-cc861.appspot.com',
    messagingSenderId: '223074442584',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
