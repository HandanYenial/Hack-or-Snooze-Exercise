"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
/**navAllStories--hidePageComponents, navLoginClick--hidePageComponents, updateNavOnLogin --updateUIOnUserLogin */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);
/**Write a function in nav.js that is called when users click that navbar link.
/** Show story submit form on clicking story "submit" */
function navSubmitStoryClick(evt){
  console.debug("navSubmitStoryClick",evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}
$navSubmitStory.on("click", navSubmitStoryClick);

/*Show favorite stories on click on favorites*/
function navFavoritesClick(evt){
  console.debug("navSubmitStoryClick",evt);
  hidePAgeComponents();
  putFavoritesListOnPage();
}
$body.on("click","#nav-favorites", navFavoritesClick);

/**Show my stories on clicking "my stories" */
function navMyStories(evt){
  console.debug("NavMyStories",evt);
  hidePAgeComponents();
  putUserStoriesOnPAge();
  $ownStories.show();

}

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents(); //in main.js
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/**Hide everything but profileon click on"profile" */
function navProfileClick(evt){
  console.debug("navProfileClick", evt);
  hidePageComponents(); //main.js
  $userProfile.show(); //user.js
}

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


/** The console.debug() method outputs a message to the web console at the 
"debug" log level. The message is only displayed to the user if the console 
is configured to display debug output. In most cases, the log level is
 configured within the console UI. This log level might correspond to the
  `Debug` or `Verbose` log level.*/