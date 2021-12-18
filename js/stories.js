"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */
/**getAndShowStoriesOnStart--start(main.js) , putStoriesOnPage --getHostName(model.js), generateStoryMarkup */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story,showDeleteBtn=false) {
  console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  const showStar=Boolean(currentUser);   // if a user is logged in, show favorite/not-favorite star
  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? getDeleteBtnHTML():""}
      ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getDeleteBtnHTML(){  /**Make delete button HTML for story */
  return` 
  <span class="trash-can">
  <i class="fas fa-trash-alt"></i>
  </span>`;

}

/*Make favorite/not favorite star for story*/
function getStarHTML(story,user){
  const isFavorite=user.isFavorite(story);
  const starType=isFavorite ? "fas" : "far";
  return `  
  <span class="star">
  <i class="${starType}fa-star"</i>
  </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  for (let story of storyList.stories) { // loop through all of our stories and generate HTML for them
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle deleting a story. */
async function submitNewStory(evt){
  console.debug("submitNewStory");
  evt.preventDefault();
  const title=$("#create-title").val(); //grab the title from the form
  const url= $("#create-url").val(); //grab the url from the form
  const author=$("#create-author").val(); //grab the author from the form
  const username=currentUser.username; // username will be the current user's username
  const storyData={title,url,author,username}; //story data will include 4 components
  const story= await storyList.addStory(currentUser,storyData); //The await keyword causes the JavaScript runtime to pause your code on this line, not allowing further code to execute in the meantime until the async function call has returned its result 
  const $story=generateStoryMarkup(story);
  $allStoriesList.prepend($story); // add the new story to the all story list

  $submitForm.slideUp("show"); //hide the form
  $submitForm.trigger("reset"); //reset the form
}
$submitForm.on("submit", submitNewStory); 
   /*when we click to the submit, it will submit the new story*/
   /*const submitForm=document.querySelector("#submit");
    submitForm.addEventListener("submit",submitNewStory)*/

function putUserStoriesOnPage(){
   console.debug("putUserStoriesOnPage");
   $ownStories.empty();
   if (currentUser.ownStories.length===0){
     $ownStories.append("<h5>No stories added by user yet</h5>");
   }else{
     for (let story of currentUser.ownStories){
       let $story=generateStoryMarkup(story,true);
       $ownStories.append($story);
     }
   }
   $ownStories.show();
  
   }

  /*Functionality for favorites list and starr/un-starr a story*/
  /** Put favorites list on page. */
  function putFavoritesListOnPage(){
    console.debug("putFavoritesListOnPage");
    $favoritedStories.empty();
    if(currentUser.favorites.length ===0){
      $favoritedStories.append("<h5>No favorites added</h5>");
    }else{
      for (let story of currentUser.favorites){
        const $story = generateStoryMarkup(sotry);
        $favoritedStories.append($story);
      }
    }
  $favoritedStories.show();
  }


/** Handle favorite/un-favorite a story */
async function toggleStoryFavorite(evt){
  console.debug("toggleStoryFavorite");
  const $tgt = $(evt.target);
  const $closestLi= $tgt.closest("li");
  const storyId=$closestLi.attr("id");
  const story = storyList.stories.find(s=>s.storyId===storyId);

// see if the item is already favorited (checking by presence of star)
 if ($tgt.hasClass("fas")){  // currently a favorite: remove from user's fav list and change star
   await currentUser.removeFavorite(story);
   $tgt.closest("i").toggleClass("fas far");
 } else{
   await currentUser.addFavorite(story); // currently not a favorite: do the opposite
   $tgt.closest("i").toggleClass("fas far");
 }
}
$storiesLists.on("click",".star", toggleStoryFavorite);






  

