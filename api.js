window.onload = function () {
      const useNodeJS = false;   // if you are not using a node server, set this value to false
      const defaultLiffId = "1655315147-BGQGoQmx";   // change the default LIFF value if you are not using a node server

      // DO NOT CHANGE THIS
      let myLiffId = "";

      // if node is used, fetch the environment variable and pass it to the LIFF method
      // otherwise, pass defaultLiffId
      if (useNodeJS) {
            fetch('/send-id')
                  .then(function (reqResponse) {
                        return reqResponse.json();
                  })
                  .then(function (jsonResponse) {
                        myLiffId = jsonResponse.id;
                        initializeLiffOrDie(myLiffId);
                  })
                  .catch(function (error) {
                        document.getElementById("liffAppContent").classList.add('hidden');
                        document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
                  });
      } else {
            myLiffId = defaultLiffId;
            initializeLiffOrDie(myLiffId);
      }
};

/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
      if (!myLiffId) {
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffIdErrorMessage").classList.remove('hidden');
      } else {
            initializeLiff(myLiffId);
      }
}

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
      liff
            .init({
                  liffId: myLiffId
            })
            .then(() => {
                  // start to use LIFF's api
                  initializeApp();
            })
            .catch((err) => {
                  document.getElementById("liffAppContent").classList.add('hidden');
                  document.getElementById("liffInitErrorMessage").classList.remove('hidden');
            });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
      displayIsInClientInfo();
      registerButtonHandlers();

      // check if the user is logged in/out, and disable inappropriate button
      if (liff.isLoggedIn()) {
            $('#avatar').show();
            $('#client-name').show();
            $('#liffLoginButton').hide();
            $('#liffLogoutButton').show();
            $('#liffAppContent').show();
           
            // document.getElementById('liffLoginButton').disabled = true;
      } else {
            $('#avatar').hide();
            $('#client-name').hide();
            $('#liffLoginButton').show();
            $('#liffLogoutButton').hide();
            $('#liffAppContent').hide();
            
            // document.getElementById('liffLogoutButton').disabled = true;
      }
}

/**
* Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
*/
function displayIsInClientInfo() {
      if (liff.isInClient()) {
            document.getElementById('liffLoginButton').classList.toggle('hidden');
            document.getElementById('liffLogoutButton').classList.toggle('hidden');
            document.getElementById('isInClientMessage').textContent = 'Diakses dari LINE';
      } else {
            document.getElementById('isInClientMessage').textContent = 'Diakses dari browser eksternal';
            document.getElementById('openWindowButton').classList.toggle('hidden');
      }
}

function registerButtonHandlers() {
      document.getElementById('openWindowButton').addEventListener('click', function () {
            liff.openWindow({
                  url: 'https://line-liff-resto.herokuapp.com/', // Isi dengan Endpoint URL aplikasi web Anda
                  external: true
            });
      });
}

function sendAlertIfNotInClient() {
      alert('Mohon maaf aplikasi ini dibuka di browser eksternal.');
}

document.getElementById('liffLoginButton').addEventListener('click', function () {
      if (!liff.isLoggedIn()) {
            liff.login();
      }
});

document.getElementById('liffLogoutButton').addEventListener('click', function () {
      if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
      }
});

