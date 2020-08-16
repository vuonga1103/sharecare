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
  postsUl = centerDashboardContainer.querySelector("#posts-ul"),
  newPostFormContainer = centerDashboardContainer.querySelector("#new-post-form-container"),
  newPostForm = newPostFormContainer.querySelector("#new-post-form"),
  importantPostsUl = document.querySelector("#priority-posts")
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
  displayImportantPosts();
}

// Displays all posts associated with the logged in caregiver's carereceiver
function displayPosts() {
  firstShowScreen.hidden = true;

  const care_receiver_id = loggedInCaregiver.care_receiver_id

  fetch(`http://localhost:3000/care-receivers/${care_receiver_id}/posts`)
    .then(response => response.json())
    .then(posts => {
      posts.reverse().forEach(post => postsUl.append(createPostLi(post)))
    });
}

function createPostLi(post){
  const postLi = document.createElement("li"),
    datePosted = post.post["created_at"].slice(0, 10);
  postLi.setAttribute("id", post.post.id);
  postLi.innerHTML = 
  `
    ${post.post.title} - by ${post.author.name} (${post.author.username}) <br>
    Posted on ${datePosted} | Priority: ${post.post.priority}<br>
    ${post.post.content} <br>
    <span id="acknowledge-span">
      <img src="images/checkmark-grey.png" style="width:15px" id="acknowledge-checkmark">
      <span id="acknowledge-text">Acknowledge</span>
    </span>
    
    <br><br>
  `
  postLi.classList.add("adding_post_animation")

  const acknowledgeSpan = postLi.querySelector("#acknowledge-span"),
    acknowledgeCheckmarkImg = acknowledgeSpan.querySelector("#acknowledge-checkmark"),
    acknowledgeTextSpan = acknowledgeSpan.querySelector("#acknowledge-text")

  if (caregiverAcknowledgedPost(post)) {
    acknowledgeCheckmarkImg.src = 'images/checkmark-green.png';
    acknowledgeTextSpan.innerText = 'Acknowledged!';
    acknowledgeSpan.style.color = 'Green'
  } 
  
  acknowledgeSpan.addEventListener("click", acknowledgePostToggle)
  return postLi
  // view comments ******
  // comment********
}

// Function to check if the logged in caregiver has acknowledged a post (return the acknowledgment if one if found-- true; otherwise return undefined-- false)
function caregiverAcknowledgedPost(post) {
  const caregiverId = loggedInCaregiver.id,
    acknowledgmentArr = post.acknowledgments;
  let acknowledgmentFound;

  if (acknowledgmentArr) {
    return acknowledgmentArr.find(acknowledgment => {
      return acknowledgment['caregiver_id'] == caregiverId
    })
  } 
  
  return false;
}

// If the post has not yet been acknowledge, call function to acknowledge the post, passing in the evt listener, otherwise, call function to unacknowledge the post, passing in the evt listener
function acknowledgePostToggle(evt) {
  const postId = parseInt(evt.target.parentElement.parentElement.id),
    acknowledgementSpan = evt.target.parentElement,
    acknowledgmentText = acknowledgementSpan.querySelector("#acknowledge-text").innerText

  if (acknowledgmentText === "Acknowledge") {
    acknowledgePost(postId) 
  } else {
    unacknowledgePost(postId)
  }
}

// Create a new acknowledgment, persist to server, change the acknowledgement visuals on DOM
function acknowledgePost(postId) {
  const newAcknowledgment = {
    caregiver_id: loggedInCaregiver.id,
    post_id: postId
  }

  fetch('http://localhost:3000/acknowledgments', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(newAcknowledgment)
  })
    .then(response => response.json())
    .then(newAcknowledgment => {
      changeAcknowledgmentVisuals(postId)
    });
}

// Make a fetch delete request, change acknowledgement visuals on DOM
function unacknowledgePost(postId) {
  const acknowledgementToDelete = {
    caregiver_id: loggedInCaregiver.id,
    post_id: postId
  }

  fetch('http://localhost:3000/acknowledgments/delete', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(acknowledgementToDelete)
  })
    .then(response => response.json())
    .then(result => {
      changeAcknowledgmentVisuals(postId)
    });
}

// Find the post by the ID on the DOM, change the color of the checkmark and text
function changeAcknowledgmentVisuals(postId) {
  const acknowledgmentSpan = document.getElementById(`${postId}`).querySelector("#acknowledge-span"),
    checkmarkImg = acknowledgmentSpan.querySelector("#acknowledge-checkmark"),
    acknowledgeText = acknowledgmentSpan.querySelector("#acknowledge-text");

  if (acknowledgeText.innerText === "Acknowledge") {
    checkmarkImg.src = "images/checkmark-green.png";
    acknowledgmentSpan.style.color = "green";
    acknowledgeText.innerText = "Acknowledged!"
  } else {
    checkmarkImg.src = "images/checkmark-grey.png"
    acknowledgmentSpan.style.color = "black";
    acknowledgeText.innerText = "Acknowledge"
  }
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

// Creates a new post on form submission; if post is valid, add to DOM, if not display errors
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
        postsUl.prepend(createPostLi(errorOrPost));
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



function displayImportantPosts() {
  const care_receiver_id = loggedInCaregiver.care_receiver_id

  fetch(`http://localhost:3000/care-receivers/${care_receiver_id}/important_posts`)
    .then(response => response.json())
    .then(posts => {
      posts.forEach(post => addToImportantPostsContainer(post))
    });
}

function addToImportantPostsContainer(post){

    const importantPostLi = document.createElement("li"),
    importantPostTitle = document.createElement("h1"),
    importantPostPriority = document.createElement("h4"),
    importantPostContent = document.createElement("p"),
    importantPostAuthor = document.createElement("h3");


    importantPostTitle.innerText = post.post.title;
    importantPostContent.innerText = post.post.content;
    importantPostPriority.innerText = post.post.priority;
    importantPostAuthor.innerText = post.author.name

    importantPostContent.hidden=true;
    importantPostAuthor.hidden=true;

    importantPostLi.append(importantPostTitle,importantPostPriority,importantPostContent,importantPostAuthor);
    importantPostsUl.append(importantPostLi);

    importantPostLi.addEventListener("click",(evt) => {
      
      if(importantPostContent.hidden === true)
      {
      importantPostContent.hidden=false;
      importantPostAuthor.hidden=false;
      importantPostLi.classList.add("expand-animation")
      importantPostLi.classList.remove("swing-out-top-bck")
    } else {
      importantPostLi.classList.remove("expand-animation")
      importantPostLi.classList.add("collapse-animation")
      importantPostContent.hidden=true;
      importantPostAuthor.hidden=true;      
    }
    })
    
}