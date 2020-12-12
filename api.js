$(document).ready(function () {
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
});

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
            $('#liffAppContent').show();

            liff.getProfile()
                  .then(profile => {
                        const name = profile.displayName
                        const avatar = profile.pictureUrl
                        console.log(avatar)
                        $('span#client-name').html(name)
                        $('#avatar').attr('src', avatar);
                  })
                  .catch((err) => {
                        M.toast({ html: `Error: ${err}` });
                  });

            if (!liff.isInClient()) {
                  $('#liffLoginMessage').hide();
                  $('#liffLoginButton').hide();
                  $('#liffLogoutButton').show();
            }
            // document.getElementById('liffLoginButton').disabled = true;
      } else {
            $('#avatar').hide();
            $('#client-name').hide();
            $('#liffAppContent').hide();

            if (!liff.isInClient()) {
                  $('#liffLoginMessage').show();
                  $('#liffLoginButton').show();
                  $('#liffLogoutButton').hide();
            }

            // document.getElementById('liffLogoutButton').disabled = true;
      }
}

/**
* Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
*/
function displayIsInClientInfo() {
      if (liff.isInClient()) {
            $('#liffLoginMessage').hide();
            $('#liffLoginButton').hide();
            $('#liffLogoutButton').hide();
            document.getElementById('isInClientMessage').textContent = 'Diakses dari LINE';
      } else {
            $('#liffLoginMessage').show();
            $('#liffLoginButton').show();
            $('#liffLogoutButton').show();
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
      M.toast({ html: 'Fitur ini hanya bisa diakses langsung via aplikasi LINE.' });
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


