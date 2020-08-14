const registerBtn = document.querySelector("#register-btn"),
      loginDiv = document.querySelector("div#login"),
      registerDiv = document.querySelector("div#register-div"),
      registerForm = document.querySelector("form#register-form"),
      signUpButton = document.getElementById("signUp"),
      signInButton = document.getElementById("signIn"),
      container = document.getElementById("container");


signUpButton.addEventListener("click", signUpLogInSlidingToggle);
signInButton.addEventListener("click", signUpLogInSlidingToggle);

// Allows for sliding toggles between signup and login
function signUpLogInSlidingToggle() {
  if (container.classList.contains("right-panel-active")) {
    container.classList.remove("right-panel-active")
    loginDiv.hidden = false;
    registerDiv.hidden = true;
  } else {
    container.classList.add("right-panel-active");
    loginDiv.hidden = true;
    registerDiv.hidden = false;
  }
}






// registerBtn.addEventListener("click", displayRegisterDiv);

// function displayRegisterDiv(evt) {
//   loginDiv.hidden = true;
//   registerDiv.hidden = false;
// }

// registerForm.addEventListener("submit", createPrimaryCaregiver);
// registerForm
// function createPrimaryCaregiver(evt) {
//   evt.preventDefault();

//   const usernameInput = evt.target['register-username'].value,
//         emailInput = evt.target['register-email'].value,
//         nameInput = evt.target['register-name'].value,
//         roleInput = evt.target['register-role'].value;

//   const newPrimaryCaregiver = {
//     name: nameInput,
//     username: usernameInput,
//     email: emailInput,
//   }

//   renderNewCareReceiverForm(newPrimaryCaregiver);
// }

// function renderNewCareReceiverForm(newPrimaryCaregiver) {
//   // display form

//   // add event listener on form, passing in newPrimaryCaregiver, pass that along into the newCareReceiver function
// }