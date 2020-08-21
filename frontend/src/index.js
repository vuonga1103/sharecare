// STABLE ELEMENTS
const webSocketUrl = 'ws://localhost:3000/cable'
const registerBtn = document.querySelector("#register-btn"),
  loginDiv = document.querySelector("div#login"),
  getHtmlTag = document.querySelector("html")
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
  importantPostsUl = document.querySelector("#priority-posts"),
  rightBottomContainer = document.querySelector("#right-bottom-container"),
  leftCareReceiverContainer = document.querySelector("#left-carereceiver-container"),
  postsSelectionBtn = document.querySelector("#posts-selection-btn"),
  leftSelectionContainer = document.querySelector('#left-selection-container'),
  teamSelectionBtn = document.querySelector("#team-selection-btn"),
  documentsSelectionBtn = document.querySelector("#documents-selection-btn"),
  myInfoSelectionBtn = document.querySelector("#my-info-selection-btn"),
  closeChatbox = document.querySelector(".close-chatbox")
  chatboxIcon = document.querySelector("#click-for-chatbox"),
  chatbox = document.querySelector(".chatbox")
  logoutSelectionBtn = document.querySelector("#logout-selection-btn");
let loggedInCaregiver;
let currentCareReceiver;



dashboard.style.display = "none";

  new Sortable(dashboard, {
    animation: 150,
  });

  new Sortable(rightMenuContainer, {
    animation: 150,
  });

  dashboard.style.display = "none";

  new Sortable(leftMenuContainer, {
    animation: 150,
  });

  new Sortable(leftSelectionContainer, {
    animation: 150,
    // ghostClass: "sortable-ghost"
  });
  
  


// var elem = postsUl
// var infScroll = new InfiniteScroll( elem, {
//   // options
//   history: false,
// });



Sortable.create(importantPostsUl,{
  group: {
    name: "priority-posts",
    put: ["posts-ul"]
    },
  animation: 100,
  onEnd: function (evt){
    // debugger
  }
});


  
// LOG IN / REGISTER FEATURES ---------------------------------------------------------------
// ------------------------------------------------------------


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

// Displays care receiver error
function displayCareReceiverError(error) {
  const errorParagraph = document.querySelector("p#carereceiver-error");
  errorParagraph.innerText = "";
  errorParagraph.innerText = error;
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
      if (Array.isArray(errorOrCaregiver)) {
        displayCareReceiverError(errorOrCaregiver) 
      } else {
        displayDashboard(errorOrCaregiver);   
      }
    });
}

// Find the caregiver by the username and email in the database with the login info entered, if not found, display login error, if found, take caregiver to dashboard
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
      if (Array.isArray(errorOrCaregiver)) {
        displayLoginError(...errorOrCaregiver)
      } else {
        displayDashboard(errorOrCaregiver)
        evt.target.reset();
      }
    });
}

// Displays login error
function displayLoginError(error) {
  const errorParagraph = document.querySelector("p#login-error");
  errorParagraph.innerText = "";
  errorParagraph.innerText = error;
}


// INITIAL DASHBOARD / POST / ACKNOWLEDGMENT / COMMENT FEATURES
// ------------------------------------------------------------
// Displays dashboard for caregiver
function displayDashboard(caregiver) {
  dashboard.style.display = "flex";
  firstShowScreen.style.display = "none"; // Hides log-in/register elements

  // Assign global loggedInCaregiver to be the caregiver who just logged in
  loggedInCaregiver = caregiver;

  // If the loggedInCaregiver doesn't have a photo, set neutral photo
  if (!loggedInCaregiver["photo_url"]) {
    loggedInCaregiver["photo_url"] = "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png"
  }

  dashboard.hidden = false; // Displays the dashboard
  fetchAllCaregivers();
  renderPostsInCenter();
  displayImportantPosts();
  
  fetchInfoForCareReceiver();
  chatboxIcon.style.display=""
  
}

// Displays all posts associated with the logged in caregiver's carereceiver; if there are no posts, display message saying so
function renderPostsInCenter() {
  firstShowScreen.hidden = true;

  getHtmlTag.style = "background: url('https://cdn.aarp.net/content/dam/aarp/work/Work_at_50%2B/2018/11/1140-caregiving-jobs.jpg') no-repeat center center fixed; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover; transition: 1s; box-shadow: inset 0 0 0 1000px rgba(0,0,0,.3);"
  const care_receiver_id = loggedInCaregiver.care_receiver_id;
  centerDashboardContainer.innerHTML = `
    <div id="new-post-form-container">
      <ul id="post-errors"></ul>
      <form id="new-post-form">
        <h3>Create a Post</h3>
        <div id="title-and-checkbox">
        <input style="width:70%;" type="text" id="post-title" placeholder="Enter Title...">
        <div style="display:flex; flex-direction: row; width:25%; align-items: center;">
        <input type="checkbox" id="post-priority" name="post-priority">
        <label for="post-priority">Important</label>
        </div>
      </div>
        <input type="text" id="post-content" placeholder="Write a message to your team...">
        <input class="submit" type="submit" value="Add Post">
      </form>
    </div>

    <div id="posts-container">
      <ul id="posts-ul">

      </ul>
    </div>
  `

  const postsContainer = centerDashboardContainer.querySelector("#posts-container"),
    postsUl = centerDashboardContainer.querySelector("#posts-ul"),
    newPostFormContainer = centerDashboardContainer.querySelector("#new-post-form-container"),
    newPostForm = newPostFormContainer.querySelector("#new-post-form");

    Sortable.create(postsUl, {
      group: {
      name: "posts-ul",
      pull: 'clone'
      },
      animation: 100,
      onEnd: function (evt){
        if(evt.to.id !== "posts-ul"){
        fetch(`http://localhost:3000/posts/`+evt.item.id)
        .then(response => response.json())
        .then(thePost => dragAndDropPost(thePost,evt))
      }
    }
    });

  newPostForm.addEventListener("submit", createNewPost);

  fetch(`http://localhost:3000/care-receivers/${care_receiver_id}/posts`)
    .then(response => response.json())
    .then(result => {
      if (Array.isArray(result)) {
        result.reverse().forEach(post => postsUl.append(createPostLi(post)))
      } else {
        postsUl.append(result.message)
      }
    });
}


//function to control the flow of drag and drop
function dragAndDropPost(thePost,evt)
{

  
  if (thePost.priority === "high"){
    evt.item.remove()
    swal({
      title: "Post Priority",
      text: "This post is already high priority",
      icon: "info",
    });
    renderPostsInCenter();
  } else if(thePost.author_id !== loggedInCaregiver.id){
    evt.item.remove()
    swal({
      title: "Permission Denied",
      text: "This post doesn't belong to you",
      icon: "warning",
    });
    renderPostsInCenter();
  } else {
    fetch('http://localhost:3000/posts/priority/' + thePost.id, {
    method: 'PATCH',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({priority:"high"})
  })
    .then(response => response.json())
    .then(errorOrPost => {

        evt.item.remove()
        swal({
          title: "Post Succesfully Updated",
          text: "This post was succesfully updated to high priority",
          icon: "success",
        });
        renderPostsInCenter();
        displayImportantPosts();
    });  


  }

}

// Responsible for creating an Li for each individual post, which has all post's info (title, content, date) AND acknowledgement and comment functions; the the post belongs to the user, then show button to edit
function createPostLi(post){
  const postLi = document.createElement("li"),
    datePosted = post.post["created_at"].slice(0, 10);
  postLi.classList += 'post-li';
  postLi.setAttribute("id", post.post.id);

  postLi.innerHTML = 
  `
    <span class='post-date-span'>Posted on ${datePosted}</span>
    <div class='post-title-important-div'>
      <span class='post-title-span'>${post.post.title}</span>
      <span class='post-important-span' style="display:none">IMPORTANT</span>
    </div>
    <span class='post-author-span'>by ${post.author.name} (${post.author.username}) </span>
    <div class='post-content-div'>${post.post.content} </div>
    <span class="acknowledgers-span"></span>

    <span class="acknowledge-span">
      <img src="images/checkmark-grey.png" style="width:15px" class="acknowledge-checkmark">
      <span class="acknowledge-text">Acknowledge</span>
    </span>
    <span class="comment-btn-span">
      <button class="comment-btn">Comments</button>
    </span>
    
    <div class="comments-container" hidden>
    <div class= "comments-form-span">
      <span class='comment-cg-img'><img src="${loggedInCaregiver.photo_url}"></span>
        <form class="comment-form">
          <input type="text" placeholder="Add a new comment...">
        </form>
      </div>
      <ul class="comments-ul">
      </ul>
    </div>
  `

    // If the post's priority is high, unhide the important span
    if (post.post.priority === "high") {
      const importantSpan = postLi.querySelector(".post-important-span");
      importantSpan.style = '';
    }
  postLi.classList.add("adding_post_animation")

  // Acknowledgement feature - allows user to click to acknowledge a post
  const acknowledgeSpan = postLi.querySelector(".acknowledge-span"),
    acknowledgeCheckmarkImg = acknowledgeSpan.querySelector(".acknowledge-checkmark"),
    acknowledgeTextSpan = acknowledgeSpan.querySelector(".acknowledge-text");

  if (caregiverAcknowledgedPost(post)) {
    acknowledgeCheckmarkImg.src = 'images/checkmark-green.png';
    acknowledgeTextSpan.innerText = 'Acknowledged!';
    acknowledgeSpan.style.color = 'Green'
  } 
  
  acknowledgeSpan.addEventListener("click", acknowledgePostToggle)
  
  // Acknowledgers feature - allows user to see a list of caregivers who acknowledged a post
  const acknowledgersSpan = postLi.querySelector(".acknowledgers-span");
  getAcknowledgersAndAttachToSpan(acknowledgersSpan, post.post.id)

  // Edit post feature
  if (post.author.id === loggedInCaregiver.id) {
    const editPostSpan = document.createElement("span");
    editPostSpan.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      width="25" height="25"
      viewBox="0 0 48 48"
      style=" fill:#000000;"><path fill="#50e6ff" d="M39,16v25c0,1.105-0.895,2-2,2H11c-1.105,0-2-0.895-2-2V7c0-1.105,0.895-2,2-2h17L39,16z"></path><linearGradient id="_kEeDraea4YIsmYS50SoDa_OIR0Uk9Fhc35_gr1" x1="28.529" x2="33.6" y1="15.472" y2="10.4" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3079d6"></stop><stop offset="1" stop-color="#297cd2"></stop></linearGradient><path fill="url(#_kEeDraea4YIsmYS50SoDa_OIR0Uk9Fhc35_gr1)" d="M28,5v9c0,1.105,0.895,2,2,2h9L28,5z"></path><path d="M39,18.602L23.101,34.504L21.868,39.4c-0.111,0.442,0.29,0.843,0.732,0.732l4.897-1.233L39,27.394	V18.602z" opacity=".05"></path><path d="M39,19.309L23.941,34.371l-0.547,1.017l0,0l-0.001,0l-0.864,3.434	c-0.099,0.392,0.256,0.746,0.648,0.648l3.446-0.868l0,0l0,0l1.006-0.543L39,26.663V19.309z" opacity=".07"></path><path fill="#c94f60" d="M42.781,21.141l-1.922-1.921c-0.292-0.293-0.768-0.293-1.061,0l-0.904,0.905l2.981,2.981l0.905-0.904	C43.073,21.908,43.073,21.434,42.781,21.141"></path><path fill="#f0f0f0" d="M24.003,35.016L23,39l3.985-1.003l0.418-3.456L24.003,35.016z"></path><path fill="#edbe00" d="M39.333,25.648L26.985,37.996l-2.981-2.981l12.348-12.348L39.333,25.648z"></path><linearGradient id="_kEeDraea4YIsmYS50SoDb_OIR0Uk9Fhc35_gr2" x1="39.112" x2="39.112" y1="20.312" y2="25.801" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#dedede"></stop><stop offset="1" stop-color="#d6d6d6"></stop></linearGradient><path fill="url(#_kEeDraea4YIsmYS50SoDb_OIR0Uk9Fhc35_gr2)" d="M36.349,22.667l2.543-2.544l2.983,2.981l-2.543,2.544L36.349,22.667z"></path><path fill="#787878" d="M23.508,36.985L23,39l2.014-0.508L23.508,36.985z"></path></svg>`;
    editPostSpan.className = "edit-post-span"
    
    const deletePostSpan = document.createElement("span");
    deletePostSpan.className = "delete-post-span"
    deletePostSpan.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      width="21" height="21"
      viewBox="0 0 512 512"
      style=" fill:#000000;"><path fill="#E04F5F" d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z"></path><path fill="#FFF" d="M285,256l72.5-84.2c7.9-9.2,6.9-23-2.3-31c-9.2-7.9-23-6.9-30.9,2.3L256,222.4l-68.2-79.2c-7.9-9.2-21.8-10.2-31-2.3c-9.2,7.9-10.2,21.8-2.3,31L227,256l-72.5,84.2c-7.9,9.2-6.9,23,2.3,31c4.1,3.6,9.2,5.3,14.3,5.3c6.2,0,12.3-2.6,16.6-7.6l68.2-79.2l68.2,79.2c4.3,5,10.5,7.6,16.6,7.6c5.1,0,10.2-1.7,14.3-5.3c9.2-7.9,10.2-21.8,2.3-31L285,256z"></path></svg>
    `;

    postLi.append(editPostSpan, deletePostSpan)
      
    editPostSpan.addEventListener('click', (evt) => displayPostEditForm(evt, post))
    
    deletePostSpan.addEventListener("click", () => { 
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          deletePost(post)
          swal("Your post was deleted succesfully!", {
            icon: "success",
          });
        } 
      });
    })
  }

  const commentsUl = postLi.querySelector(".comments-ul");
  getCommentsAndAttachToUl(commentsUl, post.post.id);

  const commentBtn = postLi.querySelector(".comment-btn"),
    commentsContainer = postLi.querySelector(".comments-container"),
    commentForm = postLi.querySelector(".comment-form");
  
  commentBtn.addEventListener('click', (evt) => {
    (commentsContainer.hidden == true) ? (commentsContainer.hidden = false) : (commentsContainer.hidden = true)
  })

  commentForm.addEventListener('submit', (evt) => {
    addCommentToPost(evt, post.post.id)
  })

  return postLi
}

// Displays popup modal for user to edit their post
function displayPostEditForm(evt, post) {
  let editModal = new tingle.modal({
    footer: false,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    });
    
  editModal.setContent(`
    <form style="padding:20px; width:700px;" id="edit-post-form">
      <label for="edit-post-title">Title</label>
      <input type="text" id="edit-post-title" name="edit-post-title">
      <label for="edit-post-content">Content</label>
      <input type="text" id="edit-post-content" name="edit-post-content">
      <label for="edit-post-checkbox">Important</label>
      <input type="checkbox" id="edit-post-checkbox" name="edit-post-checkbox">
      <input type="submit" class="submit">
    </form>
  `)


  // Grab form elements
  const editPostForm = document.querySelector("#edit-post-form"),
  editPostTitle = document.querySelector("#edit-post-title"), 
  editPostContent = document.querySelector("#edit-post-content"),
  editPostCheckbox = document.querySelector("#edit-post-checkbox");

  editPostTitle.value = post.post.title;
  editPostContent.value = post.post.content;
  (post.post.priority === "high") ? (editPostCheckbox.checked = true) : (editPostCheckbox.checked = false)

  editModal.open()

  // Add event listener on the form
  editPostForm.addEventListener("submit", (evt) => {
    editModal.close()
    editPost(evt, post)})
} 

function editPost(evt, post){
  evt.preventDefault();

  const editFormModal = document.getElementById("edit-post-modal");
  const titleInput = evt.target['edit-post-title'].value,
    contentInput = evt.target['edit-post-content'].value,
    priorityInput = evt.target['edit-post-checkbox'].checked ? 'high' : 'low';

  const editedPost = {
    title: titleInput,
    content: contentInput,
    priority: priorityInput,
    author_id: loggedInCaregiver.id
  }
  

  fetch('http://localhost:3000/posts/' + post.post.id, {
    method: 'PATCH',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(editedPost)
  })
    .then(response => response.json())
    .then(errorOrPost => {
      if (Array.isArray(errorOrPost)) {
        alert(errorOrPost[0])
      } else {
        renderPostsInCenter();
        displayImportantPosts();
        evt.target.reset();
      }
    });  
}

// Delete post, update DOM
function deletePost(post) {
  fetch('http://localhost:3000/posts/' + post.post.id, {
    method: 'DELETE',
  })
  .then(response => response.json()) 
  .then(post => {
    renderPostsInCenter();
    displayImportantPosts();
  })
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
    acknowledgmentText = acknowledgementSpan.querySelector(".acknowledge-text").innerText

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

// Find the post by the ID on the DOM, change the color of the checkmark and text, update the names of the caregivers who acknowledged the post
function changeAcknowledgmentVisuals(postId) {
  const acknowledgmentSpan = document.getElementById(`${postId}`).querySelector(".acknowledge-span"),
    checkmarkImg = acknowledgmentSpan.querySelector(".acknowledge-checkmark"),
    acknowledgeText = acknowledgmentSpan.querySelector(".acknowledge-text"),
    acknowledgersSpan = document.getElementById(`${postId}`).querySelector(".acknowledgers-span");

  if (acknowledgeText.innerText === "Acknowledge") {
    checkmarkImg.src = "images/checkmark-green.png";
    acknowledgmentSpan.style.color = "green";
    acknowledgeText.innerText = "Acknowledged!"
  } else {
    checkmarkImg.src = "images/checkmark-grey.png"
    acknowledgmentSpan.style.color = "black";
    acknowledgeText.innerText = "Acknowledge"
  }

  getAcknowledgersAndAttachToSpan(acknowledgersSpan, postId)
}

// Get the acknowledgers for post from server, attach their name to the span
function getAcknowledgersAndAttachToSpan(acknowledgersSpan, postId) {
  fetch(`http://localhost:3000/posts/${postId}/acknowledgers`)
    .then(response => response.json())
    .then(acknowledgers => {
      if (acknowledgers.length === 0) {
        acknowledgersSpan.innerText = "No one acknowledged this post yet"
      } else {
        let joinedStr = 'Acknowledged by ';
        for (let i = 0; i < acknowledgers.length; i++) {
          if (i == (acknowledgers.length - 1)) {
            joinedStr += acknowledgers[i]
          } else if (i == (acknowledgers.length - 2)) {
            (acknowledgers.length == 2) ? (joinedStr += acknowledgers[i] + ' & ') : (joinedStr += acknowledgers[i] + ', & ')
          } else {
            joinedStr += acknowledgers[i] + ', '
          }
        }
        acknowledgersSpan.innerText = joinedStr
      }
    });
}

// Fetch the post's comments create an Li for each, and append to commentsUl, if there are no comments, add a paragraph element to commentsUl with innertext of the "no comment" array
function getCommentsAndAttachToUl(commentsUl, postId) {
  fetch(`http://localhost:3000/posts/${postId}/comments`)
    .then(response => response.json())
    .then(result => {
      if (typeof result[0] == 'string') {
        const noCommentParagraph = document.createElement("p");
        noCommentParagraph.className = 'no-comment';
        noCommentParagraph.innerText = result[0];
        commentsUl.append(noCommentParagraph);
      } else {
        result.forEach(comment => commentsUl.append(createCommentLi(comment)))
      }
    });
}

// Creates an Li for a comment object, if the comment belongs to the loggedInCaregiver, give the option to delete
function createCommentLi(commentObj) {
  const commentLi = document.createElement("li");
  commentLi.setAttribute("data-comment-id", `${commentObj.id}`);
  commentLi.classList += "comment-li"

  commentLi.innerHTML = `
    <span class='comment-content'>${commentObj.content}</span>
    <span class='comment-commenter'>- ${commentObj['commenter_name']}</span>`

  if (commentObj['commenter_id'] == loggedInCaregiver.id) {
    commentLi.innerHTML += `<span class='comment-delete'><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
    width="15" height="15"
    viewBox="0 0 512 512"
    style=" fill:#000000;"><path fill="#E04F5F" d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z"></path><path fill="#FFF" d="M285,256l72.5-84.2c7.9-9.2,6.9-23-2.3-31c-9.2-7.9-23-6.9-30.9,2.3L256,222.4l-68.2-79.2c-7.9-9.2-21.8-10.2-31-2.3c-9.2,7.9-10.2,21.8-2.3,31L227,256l-72.5,84.2c-7.9,9.2-6.9,23,2.3,31c4.1,3.6,9.2,5.3,14.3,5.3c6.2,0,12.3-2.6,16.6-7.6l68.2-79.2l68.2,79.2c4.3,5,10.5,7.6,16.6,7.6c5.1,0,10.2-1.7,14.3-5.3c9.2-7.9,10.2-21.8,2.3-31L285,256z"></path></svg></span>`
    const commentDeleteBtn = commentLi.querySelector(".comment-delete");
    commentDeleteBtn.addEventListener("click", () => {    
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          deleteComment(commentLi)
          swal("Your comment was deleted succesfully!", {
            icon: "success",
          });
        } 
      });})
  }
  return commentLi
}

// Deletes comment off of server and alter DOM
function deleteComment(commentLi) {
  const commentId = commentLi.getAttribute('data-comment-id')
  
  fetch('http://localhost:3000/comments/' + commentId, {
    method: 'DELETE',
  })
  .then(response => response.json()) 
  .then(comment => {
    commentLi.remove();
  })
}

// Takes comment submitted from form, persist to server, display either the comment or the error on DOM
function addCommentToPost(evt, postId) {
  evt.preventDefault();
  
  const contentInput = evt.target.firstElementChild.value,
    commentsUl = evt.target.parentElement.parentElement.querySelector(".comments-ul");

  const newComment = {
    content: contentInput,
    commenter_id: loggedInCaregiver.id,
    post_id: postId
  };


  fetch('http://localhost:3000/comments', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(newComment)
  })
    .then(response => response.json())
    .then(result => {
      if (Array.isArray(result)) {
        swal({
          title: "Comment Error!",
          text: "You need to enter a comment",
          icon: "error",
        });
      } else {
        if (commentsUl.querySelector('.no-comment')) {
          commentsUl.querySelector('.no-comment').remove();
        }
        commentsUl.prepend(createCommentLi(result))
      }
    });

  evt.target.reset();
}

// Creates a new post on form submission; if post is valid, add to DOM, if not display errors
function createNewPost(evt) {
  evt.preventDefault();

  const postsUl = evt.target.parentElement.parentElement.querySelector("#posts-ul");
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
        swal({
          title: "Posting unsuccessful!",
          text: errorOrPost.join('\n'),
          icon: "error",
        });
      } else {
        postsUl.prepend(createPostLi(errorOrPost));
        displayImportantPosts();
        evt.target.reset();
      }
    });   
}

//fetches all important posts that are part of the care receiver that is active right now. if there is no important posts, display message saying so

function displayImportantPosts() {
  const care_receiver_id = loggedInCaregiver.care_receiver_id

  fetch(`http://localhost:3000/care-receivers/${care_receiver_id}/important_posts`)
    .then(response => response.json())
    .then(result => {
      if (Array.isArray(result)) {
        importantPostsUl.innerHTML = '';
        result.forEach(post => addToImportantPostsContainer(post))
      } else {
        document.querySelector("#priority-posts").innerText = result.message;
      }
    });
}


//add Important Post to the appropriate container and also modify their showing size on click
function addToImportantPostsContainer(post){
    const importantPostLi = document.createElement("li"),
    importantPostTitle = document.createElement("h1"),
    dateImportantPosted = document.createElement("span"),
    importantPostPriority = document.createElement("h4"),
    importantPostContent = document.createElement("p"),
    importantPostAuthor = document.createElement("h3");
    

    dateImportantPosted.innerText = post.post["created_at"].slice(0, 10);
    importantPostTitle.innerText = post.post.title;
    importantPostContent.innerText = post.post.content;
    importantPostPriority.innerText = post.post.priority;
    importantPostAuthor.innerText = post.author.name

    importantPostContent.hidden=true;
    importantPostAuthor.hidden=true;

    importantPostLi.append(importantPostTitle,dateImportantPosted,importantPostPriority,importantPostContent,importantPostAuthor);
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

//fetch all caregivers for the specific care receiver

function fetchAllCaregivers(){
  const careReceiverId = loggedInCaregiver.care_receiver_id

  
  fetch(`http://localhost:3000/care-receivers/${careReceiverId}/my_caregivers`)
    .then(response => response.json())
    .then(caregivers => {
      caregivers.sort((a, b) => a.level.localeCompare(b.level));
      caregivers.forEach(caregiver => {
        addAllCaregiversToTheContainer(caregiver)})
    });
}

//add all caregivers on the appropriate section

function addAllCaregiversToTheContainer(caregiver){
 
  if(caregiver["level"] === "primary"){
  const primaryCaregiverInformation = document.createElement("div"),
        primaryCaregiverName = document.createElement("h1"),
        primaryCaregiverRole = document.createElement("span"),
        primaryCaregiverLevel = document.createElement("h4");

        primaryCaregiverInformation.classList.add("primary-caregiver-div")
        primaryCaregiverName.innerText = caregiver["name"]
        primaryCaregiverRole.innerText = caregiver["role"]
        primaryCaregiverLevel.innerText = caregiver["level"]

        primaryCaregiverInformation.append(primaryCaregiverName,primaryCaregiverRole,primaryCaregiverLevel)
        rightBottomContainer.append(primaryCaregiverInformation)
      } else {
        const secondaryCaregiverInformation = document.createElement("div"),
        secondaryCaregiverName = document.createElement("h1"),
        secondaryCaregiverRole = document.createElement("span"),
        secondaryCaregiverLevel = document.createElement("h4");

        secondaryCaregiverInformation.classList.add("primary-caregiver-div")
        secondaryCaregiverName.innerText = caregiver["name"]
        secondaryCaregiverRole.innerText = caregiver["role"]
        secondaryCaregiverLevel.innerText = caregiver["level"]
        secondaryCaregiverLevel.id = "secondary-caregiver-level";

        secondaryCaregiverInformation.append(secondaryCaregiverName,secondaryCaregiverRole,secondaryCaregiverLevel)
        rightBottomContainer.append(secondaryCaregiverInformation)

      }
}

function fetchInfoForCareReceiver(){
  const care_receiver_id = loggedInCaregiver.care_receiver_id
  
  fetch(`http://localhost:3000/care_receivers/${care_receiver_id}`)
    .then(response => response.json())
    .then(theCareReceiver => {
      currentCareReceiver = theCareReceiver;
      debugger
      createCareReceiverWebsocketConnection(currentCareReceiver.id);
      addCareReceiverToTheDom(theCareReceiver)
    });

}

function addCareReceiverToTheDom(theCareReceiver){

    const theCareReceiverDiv = document.createElement("div"),
    careReceiverNameandAgeDiv = document.createElement("div")
    careReceiverNameandAgeDiv.id = "care-receiver-name-and-age"
    theCareReceiverName = document.createElement("h1"),
    theCareReceiverAge = document.createElement("h3")
    allergiesArray = theCareReceiver["allergies"].toLowerCase().split(/[^\w-]+/),
    theCareReceiverPrecautions = document.createElement("p"),
    theCareReceiverBio = document.createElement("p"),
    allergiesDiv = document.createElement("div")
    allergiesDiv.classList.add("care-receiver-allergies");


    allergiesArray.forEach((allergy) => {
        let allergySpan = document.createElement("span")
        allergySpan.innerText = allergy
        allergiesDiv.append(allergySpan)
    })

    theCareReceiverName.innerText = theCareReceiver.name;
    theCareReceiverAge.innerText = theCareReceiver.age
    theCareReceiverPrecautions.innerText = theCareReceiver.precautions;
    theCareReceiverBio.innerText = theCareReceiver.bio;

    careReceiverNameandAgeDiv.append(theCareReceiverName,theCareReceiverAge)
    theCareReceiverDiv.append(careReceiverNameandAgeDiv,allergiesDiv,theCareReceiverPrecautions,theCareReceiverBio);
    leftCareReceiverContainer.append(theCareReceiverDiv);
}

// LEFT SELECTION CONTAINER EVENT LISTENERS AND METHODS 
//-----------------------------------------------------

postsSelectionBtn.addEventListener("click", renderPostsInCenter);
teamSelectionBtn.addEventListener("click", renderTeamInCenter);
myInfoSelectionBtn.addEventListener("click", renderMyInfoInCenter);
documentsSelectionBtn.addEventListener("click", renderDocumentsInCenter);
logoutSelectionBtn.addEventListener("click", logCaregiverOut)

// Will display team info in center container; will show options for adding of new CG and deletion of CGs if logged-in CG is primary
function renderTeamInCenter(){
  centerDashboardContainer.innerHTML = `
    <div class="team-container">
      <div class="team-header">
        <h1 class="team-title">${currentCareReceiver.name}'s Team</h1>
      </div>
      
      <div class="cgs-container"></div>
    </div>
  `

  const caregiversContainer = centerDashboardContainer.querySelector(".cgs-container"),
    teamTitle = centerDashboardContainer.querySelector(".team-title"),
    teamContainer = centerDashboardContainer.querySelector(".team-container"),
    teamHeader = centerDashboardContainer.querySelector(".team-header");

  getCaregiversAndAppendToCaregiversContainer(caregiversContainer);

  if (loggedInCaregiver.level === "primary") {
    teamHeader.innerHTML += `
      <span>
        <button class="add-new-cg-btn">Add New Caregiver</button>
      </span>
    `
    const addNewCGBtn = document.querySelector(".add-new-cg-btn");
    
    addNewCGBtn.addEventListener("click", displayAddCGForm)
  }
}

function displayAddCGForm(){
  let addCGFormModal = new tingle.modal({
    footer: false,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    });
    
  addCGFormModal.setContent(`
    <div id="new-cg-form-div">
      <form id="new-cg-form">
        Enter New Caregiver's Info
        <input type="text" id="sec-cg-name" placeholder="Name">
        <input type="text" id="sec-cg-username" placeholder="Username">
        <input type="text" id="sec-cg-email" placeholder="Email">
        <input type="text" id="sec-cg-role" placeholder="Role (i.e. therapist, aide, etc.)">
        <button type="submit">Add to Team</button>
      </form>
    </div>
  `)

  addCGFormModal.open()

  const newCGForm = document.querySelector("#new-cg-form");
  newCGForm.addEventListener("submit", (evt) => {
    addCGFormModal.close();
    createNewSecondaryCaregiver(evt);
  })
}


// Get all caregivers associated with this care receiver, create an Li for each and append to the Ul
function getCaregiversAndAppendToCaregiversContainer(caregiversContainer) {
  fetch(`http://localhost:3000/care-receivers/${currentCareReceiver.id}/my_caregivers`)
    .then(response => response.json())
    .then(result => {
      result.forEach(cg => caregiversContainer.append(createCaregiverEl(cg)))
    });
}

// create an Li for caregiver, return the Li
function createCaregiverEl(caregiver){
  const caregiverEl = document.createElement("div");
  caregiverEl.className = 'cg-div';
  caregiverEl.innerHTML = `
    <div class="cg-img">
      <img src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png">
    </div>

    <div class="cg-info">
      <span>${caregiver.name}</span>
      <div class="team-info-div">
        <img src="https://img.icons8.com/cotton/25/000000/name--v2.png"/> <h6>Username: </h6>
        <h6>${caregiver.username}</h6>
      </div>
      <div class="team-info-div">
        <img src="https://img.icons8.com/cotton/25/000000/secured-letter--v3.png"/> <h6>Email: </h6>
        <a href="mailto:${caregiver.email}"> ${caregiver.email}</a>
      </div>
      <div class="team-info-div">
        <img src="https://img.icons8.com/cotton/22/000000/puzzle.png"/> <h6 style="margin-left:3px;">Role: </h6>
        <h6>${currentCareReceiver.name}'s ${caregiver.role}</h6>
      </div>
    </div>   
  `

  // If the caregiver has a photo_url, add that photo 
  const cgImg = caregiverEl.querySelector(".cg-img img");
  if (caregiver['photo_url']) {
    cgImg.src = caregiver['photo_url']
  }

  // Add span title, if CG is primary, then add that, if not just have name displayed
  const cgInfoEl = caregiverEl.querySelector(".cg-info");

  if (caregiver.level === "primary") {
    cgInfoEl.firstElementChild.innerHTML += ` (${caregiver.level.charAt(0).toUpperCase() + caregiver.level.slice(1)} Caregiver)`
  }

  // Add button to delete other CGs if logged in CG is primary
  if (loggedInCaregiver.level === "primary" && caregiver.id !== loggedInCaregiver.id) {
    const removeCGBtn = document.createElement("button");
    removeCGBtn.innerText = "Remove"
    cgInfoEl.append(removeCGBtn)

    removeCGBtn.addEventListener("click", () => {
      swal({
        // title: "Are you sure you want to delete this post?",
        // text: "Once deleted, you will not be able to recover this!",
        text: "Are you sure you want to remove this caregiver?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          deleteCaregiver(caregiver)
          swal("Caregiver was removed.", {
            icon: "success",
          });
        } 
      });
    })
  }

  return caregiverEl;
}




// Creates a new secondary CG and add them to the caregiversContainer, if not successfully created, display message that says so
function createNewSecondaryCaregiver(evt) {
  evt.preventDefault();
  const caregiversContainer = document.querySelector(".cgs-container");
  const nameInput = evt.target['sec-cg-name'].value,
    usernameInput = evt.target['sec-cg-username'].value,
    emailInput = evt.target['sec-cg-email'].value,
    roleInput = evt.target['sec-cg-role'].value;

  const newCaregiver = {
    name: nameInput,
    username: usernameInput,
    email: emailInput,
    role: roleInput,
    level: "secondary",
    care_receiver_id: currentCareReceiver.id,
  };

  fetch("http://localhost:3000/caregivers", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(newCaregiver),
  })
    .then((response) => response.json())
    .then((errorsOrCaregiver) => {
      if (Array.isArray(errorsOrCaregiver)) {
        swal({
          title: "Error creating an account!",
          text: errorsOrCaregiver.join('\n'),
          icon: "error",
        });
      } else {
        swal({
          title: "Account successfully created",
          text: "Caregiver Succesfully added",
          icon: "success",
        });
        caregiversContainer.append(createCaregiverEl(errorsOrCaregiver));
        evt.target.reset();
      }
    });
}


// Delete caregiver and update dom
function deleteCaregiver(caregiver){
  fetch('http://localhost:3000/caregivers/' + caregiver.id, {
  method: 'DELETE',
  })
    .then(response => response.json()) 
    .then(result => renderTeamInCenter())
}

// Display current user's info in the center container
function renderMyInfoInCenter(){
  centerDashboardContainer.innerHTML = `
    <div class="my-info-container-parent">
      <h1 style="text-align: center; margin-bottom: 10px;">My Info</h1>
      <div id="my-info-container">
        <div id="photo-and-info-div">
          
          <div id="photo-div">
            <img id='cg-photo-img' src="${loggedInCaregiver.photo_url}">
            <span id='change-photo-span'>
            <img src="https://img.icons8.com/cotton/75/000000/compact-camera.png"/>
            </span>
          </div>
        
          <div class="my-info-main-div">
          <h1 id="my-info-name">${loggedInCaregiver.name}</h1>
            <ul id="my-info-ul">
              <li id='my-info-username'><img src="https://img.icons8.com/cotton/35/000000/name--v2.png">Username: <h5>${loggedInCaregiver.username}</h5></li>
              <li id='my-info-email'><img src="https://img.icons8.com/cotton/35/000000/secured-letter--v3.png">Email: <h5>${loggedInCaregiver.email}</h5></li>
              <li id='my-info-role'><img style="margin-right:23px;" src="https://img.icons8.com/cotton/32/000000/puzzle.png">Role: <h5>${currentCareReceiver.name}'s ${loggedInCaregiver.role}</h5></li>
              <li id='my-info-level'>You are a ${loggedInCaregiver.level} caregiver</li>
            </ul>
            <button id='my-info-edit-btn'>Edit My Info</button>            
          </div>
        </div>
      
        
        <form id='my-info-edit-form' style="display:none;">
          <label for="my-info-name-input">Name: </label>
          <input type='text' id='my-info-name-input' name='my-info-name-input' value='${loggedInCaregiver.name}'>

          <label for="my-info-username-input">Username: </label>
          <input type='text' id='my-info-username-input' name='my-info-username-input' value='${loggedInCaregiver.username}'>

          <label for="my-info-email-input">Email: </label>
          <input type='text' id='my-info-email-input' name='my-info-email-input' value='${loggedInCaregiver.email}'>

          <label for="my-info-role-input">Role: </label>
          <input type='text' id='my-info-role-input' name='my-info-role-input' value='${loggedInCaregiver.role}'>

          <input type='submit' class="submit">
        </form>
      </div>  
    </div>

  `

  const editBtn = document.querySelector("#my-info-edit-btn");
  editBtn.addEventListener("click", toggleDisplayMyInfoEditForm)

  const editMyInfoForm = document.querySelector("#my-info-edit-form")
  editMyInfoForm.addEventListener("submit", editMyInfo)

  const photoUpdateEl = document.querySelector("#change-photo-span");
  photoUpdateEl.addEventListener("click", displayPhotoUploadForm)
}

// Displays photo upload form in modal
function displayPhotoUploadForm(){
  let photoUploadModal = new tingle.modal({
    footer: false,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    });
    
  photoUploadModal.setContent(`
    <form style="padding:20px; width:700px;" id="photo-upload-form">
      <h4>Change Your Profile Photo</h4>
      <input type="file" id="profile-photo" accept="image/png, image/jpeg">
      <input type="submit" class="submit" value="upload">
    </form>
  `)

  photoUploadModal.open();
  
  const photoUploadForm = document.querySelector("#photo-upload-form");
  photoUploadForm.addEventListener("submit", (evt) => {
    photoUploadModal.close();
    uploadPhoto(evt);
  });
}

// Upload a photo to the database
function uploadPhoto(evt) {
  evt.preventDefault();

  const photoFile = evt.target['profile-photo'].files[0];
  const formData = new FormData();

  formData.append('photo', photoFile);

  fetch(`http://localhost:3000/caregivers/${loggedInCaregiver.id}/upload_photo`, {
    method: 'POST',
    headers: { 'Accept': 'application/json'},
    body: formData
  })
    .then(response => response.json())
    .then(photoObj => {
      loggedInCaregiver["photo_url"] = photoObj["photo_url"];
      renderMyInfoInCenter();
    });
}

// Toggle display of my info edit display form
function toggleDisplayMyInfoEditForm(evt){
  const editMyInfoForm = document.querySelector("#my-info-edit-form");
  
  (editMyInfoForm.style.display === 'none') ? (editMyInfoForm.style.removeProperty("display")) : (editMyInfoForm.style.display = 'none')
}

// Submit patch request to update current logged in caregiver's info, display new info on dom
function editMyInfo(evt) {
  evt.preventDefault();
  const inputName = evt.target['my-info-name-input'].value,
    inputUsername = evt.target['my-info-username-input'].value,
    inputEmail = evt.target['my-info-email-input'].value,
    inputRole = evt.target['my-info-role-input'].value;

  const editedCaregiver = {
    name: inputName,
    username: inputUsername,
    email: inputEmail,
    care_receiver_id: currentCareReceiver.id,
    role: inputRole,
    level: loggedInCaregiver.level
  }

  fetch('http://localhost:3000/caregivers/' + loggedInCaregiver.id, {
    method: 'PATCH',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(editedCaregiver)
  })
    .then(response => response.json())
    .then(result => {
      if (Array.isArray(result)) {
        alert(...result)
      } else {
        loggedInCaregiver = result;
        renderMyInfoInCenter();
      }
    });
}

//render the document uploading form according to the authorized level
function renderDocumentsInCenter(){

  if(loggedInCaregiver.level === "primary"){
  centerDashboardContainer.innerHTML = `
  <div id="documents-window">
  <form id="upload-document">
  <h3>Upload a Document</h3>
    <input type="text" placeholder="Document Title" name="document-title">
    <input type="text" placeholder="Document Description" name="document-description">
    <input type="file" name="document">
    <select name="privacy" id="privacy-select">
      <option value="private">Private</option>
      <option value="public">Public</option>
    </select>
    <input type="submit" value="Submit Document" class="submit">
  </form>
    <ul id="documents-list">
    </ul>
  </div>
  </div>
  `
} else {
  centerDashboardContainer.innerHTML = `
  <div id="documents-window">
  <form id="upload-document">
  <h3>Upload a Document</h3>
    <input type="text" placeholder="Document Title" name="document-title">
    <input type="text" placeholder="Document Description" name="document-description">
    <input type="file" name="document">
    <input type="submit" value="Submit Document" class="submit">
  </form>
    <ul id="documents-list">
    </ul>
  </div>
  `
}
  // renderAllDocuments()
  fetchAllDocuments()
  const documentFormUploader = document.querySelector("#upload-document")
  documentFormUploader.addEventListener("submit",(evt) => documentUploadFetching(evt))
}


//upload a document to the server
function documentUploadFetching(evt)
{
  evt.preventDefault()

  const documentTitle = evt.target['document-title'].value
  const documentDescription = evt.target['document-description'].value
  let documentPrivacy = ""
  if(loggedInCaregiver.level === "primary"){
    documentPrivacy = evt.target['privacy'].value
} else {
    documentPrivacy = "public"
}
  const documentFile = evt.target['document'].files[0]


  const formData = new FormData()

  formData.append('title',documentTitle)
  formData.append('description',documentDescription)
  formData.append('privacy',documentPrivacy)
  formData.append('caregiver_id', loggedInCaregiver.id)
  formData.append('document',documentFile)
  
  fetch('http://localhost:3000/caregivers/upload_document', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(response => response.json())
        .then(fileURL => {
          evt.target.reset()
          renderDocumentToContainer(fileURL)
        })

}
// Reset currentCareReceiver and loggedInCaregiver, then reload page to go back to signin screen
function logCaregiverOut() {
  loggedInCaregiver = '';
  currentCareReceiver = '';
  location.reload();
}

//fetch all the documents for the active care receiver
function fetchAllDocuments(){
  fetch(`http://localhost:3000/caregivers/${currentCareReceiver.id}/care_receiver_documents`)
        .then(response => response.json())
        .then(documentsInfo => {
          if(loggedInCaregiver.level === "primary"){
          documentsInfo.forEach((documentInfo) => {
            renderDocumentToContainer(documentInfo)
          })
        } else {
          documentsInfo.forEach((documentInfo) => {
            if(documentInfo.privacy === "public"){
            renderDocumentToContainer(documentInfo)
          }
          })
        }})
}


function renderDocumentToContainer(documentInfo){

const documentsUl = document.querySelector("#documents-list")

const documentLi = document.createElement("li"),
    documentLiTitle = document.createElement("h4"),
    documentCreatedDate = document.createElement("span"),
    documentLiAuthor = document.createElement("h6"),
    documentLiDescription = document.createElement("p"),
    documentLiPrivacy = document.createElement("span"),
    documentLiFileIcon = document.createElement("span"),
    mainDocumentInfo = document.createElement("div"),
    secondaryDocumentInfo = document.createElement("div")
    documentLi.classList.add("adding_post_animation")
    mainDocumentInfo.classList.add("main-document-info-class")
    if(documentInfo.document.slice(-3) === "pdf"){
    documentLiFileIcon.innerHTML = '<img src="https://img.icons8.com/cute-clipart/64/000000/pdf.png"/>'
  } else {
    documentLiFileIcon.innerHTML = '<img src="https://img.icons8.com/cute-clipart/64/000000/image-file.png"/>'
  }

  documentCreatedDate.classList.add("document-created-date")
    documentCreatedDate.innerText = `Added on: ${documentInfo["created_at"].slice(0, 10)}`;
    documentLiTitle.innerText = documentInfo.title
    documentLiAuthor.innerText = `by ${documentInfo.author}`
    documentLiDescription.innerText = documentInfo.description
    documentLiPrivacy.innerText = documentInfo.privacy
    documentLiPrivacy.classList.add("document-privacy-span")
    secondaryDocumentInfo.append(documentLiFileIcon,documentLiPrivacy)
    mainDocumentInfo.append(documentCreatedDate,documentLiTitle,documentLiAuthor,documentLiDescription)
    documentLi.append(mainDocumentInfo,secondaryDocumentInfo)

    documentsUl.prepend(documentLi)
    
      let modal = new tingle.modal({
        footer: true,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['custom-class-1', 'custom-class-2'],
        onClose: function(){
          modal.setContent('')
        }
        });
        modal.addFooterBtn('Delete', 'tingle-btn tingle-btn--primary', function() {
          deleteDocument(documentInfo)
          modal.close();
          swal({
            title: "Document succesfully Deleted",
            text: "This post was succesfully deleted",
            icon: "success",
          });
      });
    
    documentLi.addEventListener('click',(evt) => {
      if(documentInfo.document.slice(-3) === "pdf"){
      modal.setContent('<div style="height:900px; width:700px" id="modal-div"></div>')  
      PDFObject.embed(documentInfo.document, "#modal-div"); 
      modal.open()
    } else {
      modal.setContent(`<img style="height:900px; max-width:auto; width:700px; object-fit:contain;" src=${documentInfo.document}>`)
      
      modal.open()
    }
    })
}


function deleteDocument(documentInfo){
    fetch('http://localhost:3000/documents/'+ documentInfo.id, {
      method: 'DELETE',
    })
    .then(response => response.json()) 
    .then(post => {
      fetchAllDocuments()
    })
  }






  // WEBSOCKET

  function createCareReceiverWebsocketConnection(careReceiverId) {
    socket = new WebSocket(webSocketUrl);
    socket.onopen = function(event) {
      console.log('WebSocket is connected.');

      const msg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          id: careReceiverId,
          channel: 'CareReceiverChannel'
        }),
      } 

      socket.send(JSON.stringify(msg));
    };

    socket.onclose = function(event) {
      console.log('WebSocket is closed.');
    };

    socket.onmessage = function(event) {            
      const response = event.data;
      const msg = JSON.parse(response);
      
      // Ignores pings.
      if (msg.type === "ping") {
          return;
      }
      console.log("FROM RAILS: ", msg);
      
      // Renders any newly created messages onto the page.
      if (msg.message) {
          const messagesContainer = document.querySelector(".messages-container");
          debugger
          messagesContainer.innerHTML += msg.message.content;

          // FIX THIS UP LATERRRRRRRRRRRRRRR
      }   
    };

    socket.onerror = function(error) {
      debugger
      console.log('WebSocket Error: ' + error);
    };

  }

  const newMessageForm = document.querySelector("#new-message-form");

  // Allow users to submit new messages
  newMessageForm.addEventListener('submit', event => {
    event.preventDefault();

    fetch(`http://localhost:3000/messages`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            content: event.target[0].value,
            care_receiver_id: currentCareReceiver.id
        })
    })
    // .then(response => response.json())
    // .then(messageObject => {
    //   const messagesContainer = document.querySelector(".messages-container");

    //   messagesContainer.innerHTML += messageObject.content;
    // })


    newMessageForm.reset();
})

chatboxIcon.addEventListener("click",(evt) => {
  chatbox.style.display="flex"
  chatboxIcon.style.display="none"
  closeChatbox.style.display=""
})

closeChatbox.addEventListener("click",(evt) => {
  chatbox.style.display="none"
  chatboxIcon.style.display=""
  closeChatbox.style.display="none"
})



