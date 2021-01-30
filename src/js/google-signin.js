// Client ID and API key from the Developer Console
var CLIENT_ID =
  "135378639975-lds5235dobvdd8aob3t0agiceuugio0a.apps.googleusercontent.com";
var API_KEY = "AIzaSyAFZp7ia8K_Jr6CL2Q4V6MiQaTFVDW9BCk";
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

export function isSignedIn() {
  return gapi.auth2.getAuthInstance().isSignedIn.get();
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
export function initGapi(onAuthChangedCallback) {
  gapi.load("client:auth2", async () => {
    try {
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(onAuthChangedCallback);

      // Handle the initial sign-in state.
      onAuthChangedCallback(gapi.auth2.getAuthInstance().isSignedIn.get());
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  });
}

/**
 *  Sign in the user upon button click.
 */
export function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
export function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
