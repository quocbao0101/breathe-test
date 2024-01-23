// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'http://192.168.195.93:8081',
    firebase: {
      apiKey: "AIzaSyDlu2jzz6A-bFEK52QmBRPTWFaxdbpt-lo",
      authDomain: "breathe-out.firebaseapp.com",
      projectId: "breathe-out",
      storageBucket: "breathe-out.appspot.com",
      messagingSenderId: "814263183479",
      appId: "1:814263183479:web:fdb2d4442f541390bb3e72",
      measurementId: "G-3F36YKQ8MW"
    }
    // apiUrl: 'https://localhost:5001',
  };

  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
