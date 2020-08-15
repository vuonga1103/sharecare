// STABLE ELEMENTS
const registerBtn = document.querySelector("#register-btn"),
  loginDiv = document.querySelector("div#login"),
  registerDiv = document.querySelector("div#register-div"),
  registerForm = document.querySelector("form#register-form"),
  signUpButton = document.getElementById("signUp"),
  signInButton = document.getElementById("signIn"),
  container = document.getElementById("container"),
  registerErrorsUl = document.querySelector("ul#register-errors"),
  loginForm = document.querySelector("form#login-form"),
  leftMenuContainer = document.querySelector("div#left-menu-container"),
  rightMenuContainer = document.querySelector("div#right-menu-container"),
  firstShowScreen = document.querySelector("#first-show"),
  dashboard = document.querySelector("#dashboard"),
  centerDashboardContainer = document.querySelector("#center-container"),
  postsContainer = centerDashboardContainer.querySelector("#posts-container"),
  newPostFormContainer = centerDashboardContainer.querySelector("#new-post-form-container"),
  newPostForm = newPostFormContainer.querySelector("#new-post-form")
let loggedInCaregiver;

dashboard.style.display = "none";

  
// LOG IN / REGISTER FEATURES -----------------------------------------------
// EVENT LISTENERS
signUpButton.addEventListener("click", signUpLogInSlidingToggle);
signInButton.addEventListener("click", signUpLogInSlidingToggle);
registerForm.addEventListener("submit", createNewPrimaryCaregiver);
loginForm.addEventListener("submit", findCaregiver);
newPostForm.addEventListener("submit", createNewPost);

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
      <p id="carereceiver-error"></p>
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

// Creates a care receiver, linking it to the newPrimaryCaregiver who signed up, via the caregiver's id, if care receiver was successfully created then take the new user/caregiver to their dashboard, otherwise display error
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
    .then((errorOrCaregiver) => {
      Array.isArray(errorOrCaregiver) ? displayCareReceiverError(errorOrCaregiver) : displayDashboard(errorOrCaregiver)
    });
}

// Displays dashboard for caregiver
function displayDashboard(caregiver) {
  dashboard.style.display = "flex";
  firstShowScreen.style.display = "none"; // Hides log-in/register elements

  // Assign global loggedInCaregiver to be the caregiver who just logged in
  loggedInCaregiver = caregiver;

  dashboard.hidden = false; // Displays the dashboard
  displayPosts();
}

// Displays all posts associated with the logged in caregiver's carereceiver
function displayPosts() {
  firstShowScreen.hidden = true;

  const care_receiver_id = loggedInCaregiver.care_receiver_id

  fetch(`http://localhost:3000/care-receivers/${care_receiver_id}/posts`)
    .then(response => response.json())
    .then(posts => {
      posts.forEach(post => addToPostsContainer(post))
    });
}

// Creates needed elements for post, add to main container
function addToPostsContainer(post){

  const postUl = document.createElement("ul"),
    postTitleLi = document.createElement("li"),
    postContentLi = document.createElement("li"),
    postPriorityLi = document.createElement("li"),
    postAuthorLi = document.createElement("li");

    postTitleLi.innerText = post.post.title;
    postContentLi.innerText = post.post.content;
    postPriorityLi.innerText = post.post.priority;
    postAuthorLi.innerText = post.author.name

  postUl.append(postTitleLi, postContentLi, postPriorityLi, postAuthorLi)

  postsContainer.append(postUl)
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

// Displays care receiver error
function displayCareReceiverError(error) {
  const errorParagraph = document.querySelector("p#carereceiver-error");
  errorParagraph.innerText = "";
  errorParagraph.innerText = error;
}

// Creates a new post on form submission
function createNewPost(evt) {
  evt.preventDefault();
  const titleInput = evt.target['post-title'].value,  
    contentInput = evt.target['post-content'].value, 
    priorityInput = evt.target['post-priority'].checked ? 'high' : 'low',

    newPost = {
      title: titleInput,
      content: contentInput,
      priority: priorityInput,
      author_id: loggedInCaregiver.id
    };

  fetch('http://localhost:3000/posts', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost)
  })
    .then(response => response.json())
    .then(errorOrPost => {
      if (Array.isArray(errorOrPost)) {
        displayPostErrors(errorOrPost)
      } else {
        addToPostsContainer(errorOrPost);
        evt.target.reset();
      }
    });   
}

function displayPostErrors(errors) {
  const postErrorUl = newPostFormContainer.querySelector("#post-errors")

  postErrorUl.innerHTML = '';

  errors.forEach(error => {
    const postErrorLi = document.createElement("li");
    postErrorLi.innerText = error;
    postErrorUl.append(postErrorLi)
  })
}