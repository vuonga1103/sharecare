// STABLE ELEMENTS

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
  teamSelectionBtn = document.querySelector("#team-selection-btn"),
  documentsSelectionBtn = document.querySelector("#documents-selection-btn"),
  myInfoSelectionBtn = document.querySelector("#my-info-selection-btn"),
  logoutSelectionBtn = document.querySelector("#logout-selection-btn");
let loggedInCaregiver;
let currentCareReceiver;



dashboard.style.display = "none";

  new Sortable(dashboard, {
    animation: 150,
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
    debugger
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
      Array.isArray(errorOrCaregiver) ? displayCareReceiverError(errorOrCaregiver) : displayDashboard(errorOrCaregiver)
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


// INITIAL DASHBOARD / POST / ACKNOWLEDGMENT / COMMENT FEATURES
// ------------------------------------------------------------
// Displays dashboard for caregiver
function displayDashboard(caregiver) {
  dashboard.style.display = "flex";
  firstShowScreen.style.display = "none"; // Hides log-in/register elements

  // Assign global loggedInCaregiver to be the caregiver who just logged in
  loggedInCaregiver = caregiver;

  dashboard.hidden = false; // Displays the dashboard
  renderPostsInCenter();
  displayImportantPosts();
  fetchAllCaregivers();
  fetchInfoForCareReceiver();
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
      pull: true
      },
      animation: 100,
      // onEnd: function (evt){
      //   debugger
      // }
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

// Responsible for creating an Li for each individual post, which has all post's info (title, content, date) AND acknowledgement and comment functions
function createPostLi(post){
  const postLi = document.createElement("li"),
    datePosted = post.post["created_at"].slice(0, 10);
  postLi.setAttribute("id", post.post.id);

  postLi.innerHTML = 
  `
    ${post.post.title} - by ${post.author.name} (${post.author.username}) <br>
    Posted on ${datePosted} | Priority: ${post.post.priority}<br>
    ${post.post.content} <br>
    <span class="acknowledge-span">
      <img src="images/checkmark-grey.png" style="width:15px" class="acknowledge-checkmark">
      <span class="acknowledge-text">Acknowledge</span>
    </span>
    <br>
    <span class="acknowledgers-span"></span>
    <br>
    
    <button class="comment-btn">Comments</button>

    <div class="comments-container" hidden>
      <form class="comment-form">
        <input type="text" placeholder="Add a new comment...">
        <input type="submit">
      </form>

      <ul class="comments-ul">
      </ul>
    </div>
    <br><br>
  `
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

  // Comment feature - allows user to toggle hidding of comment section, which has comment form
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

// Creates an Li for a comment object
function createCommentLi(commentObj) {
  const commentLi = document.createElement("li");
  commentLi.innerText = commentObj.content;
  commentLi.innerText += ' - ' + commentObj['commenter_name']
  return commentLi
}

// Takes comment submitted from form, persist to server, display either the comment or the error on DOM
function addCommentToPost(evt, postId) {
  evt.preventDefault();

  const contentInput = evt.target.firstElementChild.value,
    commentsUl = evt.target.parentElement.querySelector(".comments-ul");

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
        alert(...result)
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
        alert(errorOrPost.join('\n'))
      } else {
        postsUl.prepend(createPostLi(errorOrPost));
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
  const care_receiver_id = loggedInCaregiver.care_receiver_id

  fetch(`http://localhost:3000/care-receivers/${care_receiver_id}/my_caregivers`)
    .then(response => response.json())
    .then(caregivers => {
      caregivers["caregivers"].sort((a, b) => a.level.localeCompare(b.level));
      caregivers["caregivers"].forEach(caregiver => addAllCaregiversToTheContainer(caregiver))
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
 console.log(care_receiver_id)
  fetch(`http://localhost:3000/care_receivers/${care_receiver_id}`)
    .then(response => response.json())
    .then(theCareReceiver => {
      currentCareReceiver = theCareReceiver;
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

// Will display team info in center container; will show options for adding of new CG and deletion of CGs if logged-in CG is primary
function renderTeamInCenter(){
  centerDashboardContainer.innerHTML = `
    <div id="team-container">
      <h1 id="team-title">${currentCareReceiver.name}'s Team</h1>
      <ul id="cg-ul"></ul>
    </div>
  `

  const caregiversUl = centerDashboardContainer.querySelector("#cg-ul"),
    teamTitle = centerDashboardContainer.querySelector("#team-title"),
    teamContainer = centerDashboardContainer.querySelector("#team-container");

  getCaregiversAndAppendToCaregiversUl(caregiversUl);

  if (loggedInCaregiver.level === "primary") {
    const newCGFormDiv = document.createElement("div");
    const addNewCGBtn = document.createElement("button");
    newCGFormDiv.id = 'new-cg-form-container';
    addNewCGBtn.id = 'add-new-cg-btn';
    addNewCGBtn.innerText = 'Add a New Caregiver';
    newCGFormDiv.append(addNewCGBtn);

    teamContainer.insertBefore(newCGFormDiv, caregiversUl);
    
    addNewCGBtn.addEventListener("click", () => addCGFormToFormDiv(newCGFormDiv))
  }

}

// Get all caregivers associated with this care receiver, create an Li for each and append to the Ul
function getCaregiversAndAppendToCaregiversUl(caregiversUl) {
  fetch(`http://localhost:3000/care-receivers/${currentCareReceiver.id}/my_caregivers`)
    .then(response => response.json())
    .then(result => {
      result.caregivers.forEach(cg => caregiversUl.append(createCaregiverLi(cg)))
    });
}

// create an Li for caregiver, return the Li
function createCaregiverLi(caregiver){
  const caregiverLi = document.createElement("li");
  caregiverLi.innerHTML = `
    Name: ${caregiver.name} <br>
    Username: ${caregiver.username}<br>
    Role: ${caregiver.role}<br>
    Level: ${caregiver.level}<br>
  `
  
  // Add button to delete other CGs if logged in CG is primary
  if (loggedInCaregiver.level === "primary" && caregiver.id !== loggedInCaregiver.id) {
    const removeCGBtn = document.createElement("button");
    removeCGBtn.innerText = "Remove"
    caregiverLi.append(removeCGBtn)

    removeCGBtn.addEventListener("click", deleteCaregiver(caregiver))
  }
  

  return caregiverLi;
}

// display new CG form on form div
function addCGFormToFormDiv(newCGFormDiv){
  newCGFormDiv.innerHTML = `
    <form id="new-cg-form">
      Enter New Caregiver's Info
      <input type="text" id="sec-cg-name" placeholder="Name">
      <input type="text" id="sec-cg-username" placeholder="Username">
      <input type="text" id="sec-cg-email" placeholder="Email">
      <input type="text" id="sec-cg-role" placeholder="Role (i.e. therapist, aide, etc.)">
      <input type="submit">
    </form>
  `
  const newCGForm = newCGFormDiv.querySelector("#new-cg-form");

  newCGForm.addEventListener("submit", createNewSecondaryCaregiver)
}

function createNewSecondaryCaregiver(evt) {
  evt.preventDefault();
  const caregiversUl = evt.target.parentElement.parentElement.querySelector("#cg-ul");
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
        alert(errorsOrCaregiver.join('\n'))
      } else {
        alert("Caregiver successfully added!")
        caregiversUl.append(createCaregiverLi(errorsOrCaregiver));
        evt.target.reset();
      }
    });
}

function deleteCaregiver(caregiver){
  
}