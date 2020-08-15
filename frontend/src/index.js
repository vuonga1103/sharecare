// STABLE ELEMENTS
const registerBtn = document.querySelector("#register-btn"),
  loginDiv = document.querySelector("div#login"),
  registerDiv = document.querySelector("div#register-div"),
  registerForm = document.querySelector("form#register-form"),
  signUpButton = document.getElementById("signUp"),
  signInButton = document.getElementById("signIn"),
  container = document.getElementById("container"),
  registerErrorsUl = document.querySelector("ul#register-errors"),
  loginForm = document.querySelector("form#login-form");

  
// LOG IN / REGISTER FEATURES -----------------------------------------------
// EVENT LISTENERS
signUpButton.addEventListener("click", signUpLogInSlidingToggle);
signInButton.addEventListener("click", signUpLogInSlidingToggle);
registerForm.addEventListener("submit", createNewPrimaryCaregiver);
loginForm.addEventListener("submit", findCaregiver);

// Allows for sliding toggle between sign up and log in forms
function signUpLogInSlidingToggle() {
  if (container.classList.contains("right-panel-active")) {
    container.classList.remove("right-panel-active");
  } else {
    container.classList.add("right-panel-active");
    registerForm.removeAttribute("style");
  }
}

// Creates a new primary caregiver upon sign up; will display errors if inputs are invalid, otherwise will render form for user to input care receiver's info
function createNewPrimaryCaregiver(evt) {
  evt.preventDefault();

  const usernameInput = evt.target["register-username"].value,
    emailInput = evt.target["register-email"].value,
    nameInput = evt.target["register-name"].value,
    roleInput = evt.target["register-role"].value;

  const newCaregiver = {
    name: nameInput,
    username: usernameInput,
    email: emailInput,
    role: roleInput,
    level: "primary",
  };

  fetch("http://localhost:3000/caregivers", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(newCaregiver),
  })
    .then((response) => response.json())
    .then((errorsOrCaregiver) => {
      Array.isArray(errorsOrCaregiver)
        ? displayRegisterErrors(errorsOrCaregiver)
        : displayCreateCareReceiverForm(errorsOrCaregiver);
    });
}

// Takes an array of errors and display them in registerErrorsUl
function displayRegisterErrors(errors) {
  registerErrorsUl.textContent = "";
  errors.forEach((error) => {
    const errorLi = document.createElement("li");
    errorLi.innerText = error;
    registerErrorsUl.append(errorLi);
  });
}

// Displays form for user to input info about care receiver
function displayCreateCareReceiverForm(newPrimaryCaregiver) {
  registerForm.hidden = true;

  registerDiv.innerHTML = `
    <form id="register-carereceiver-form">
      <h1>Add Care Receiver Info</h1>
      <input id="register-carereceiver-name" type="text" placeholder="Name" />
      <input id="register-carereceiver-age" type="number" placeholder="Age" />
      <input id="register-carereceiver-allergies" type="text" placeholder="Known Allergies" />
      <input id="register-carereceiver-precautions" type="text" placeholder="Precautions" />
      <input id="register-carereceiver-bio" type="text" rows="2" placeholder="Enter a Brief Bio" />
      <input type="submit" class="submit" value="Next" />
  </form>
  `;

  const registerCareReceiverForm = registerDiv.querySelector(
    "form#register-carereceiver-form"
  );

  // On submission, create a care receiver
  registerCareReceiverForm.addEventListener("submit", (evt) => {
    createCareReceiver(evt, newPrimaryCaregiver);
  });
}

// Creates a care receiver, linking it to the newPrimaryCaregiver who signed up, via the caregiver's id, then take the new user/caregiver to their dashboard
function createCareReceiver(evt, newPrimaryCaregiver) {
  evt.preventDefault();

  const nameInput = evt.target["register-carereceiver-name"].value,
    ageInput = evt.target["register-carereceiver-age"].value,
    allergiesInput = evt.target["register-carereceiver-allergies"].value,
    precautionsInput = evt.target["register-carereceiver-precautions"].value,
    bioInput = evt.target["register-carereceiver-bio"].value;

  const newCareReceiver = {
    name: nameInput,
    age: parseInt(ageInput),
    allergies: allergiesInput,
    precautions: precautionsInput,
    bio: bioInput,
    caregiver_id: newPrimaryCaregiver.id,
  };

  fetch("http://localhost:3000/care-receivers", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(newCareReceiver),
  })
    .then((response) => response.json())
    .then((caregiver) => {
      displayDashboard(caregiver);
    });
}

// COMPLETE MEEEEEEEEEEEEEEEEE
// displays dashboard for a caregiver
function displayDashboard(caregiver) {
  console.log("to be completed");
}

// Find the caregiver by the username and email in the database, if not found, display login error, if found, take caregiver to dashboard
function findCaregiver(evt) {
  evt.preventDefault();

  const usernameInput = evt.target["login-username"].value,
    emailInput = evt.target["login-email"].value;

  caregiver = {
    username: usernameInput,
    email: emailInput,
  };

  fetch("http://localhost:3000/caregivers/login", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(caregiver),
  })
    .then((response) => response.json())
    .then((errorOrCaregiver) => {
      Array.isArray(errorOrCaregiver)
        ? displayLoginError(...errorOrCaregiver)
        : displayDashboard(errorOrCaregiver);
    });
}

// Displays login error
function displayLoginError(error) {
  const errorParagraph = document.querySelector("p#login-error");
  errorParagraph.innerText = "";
  errorParagraph.innerText = error;
}