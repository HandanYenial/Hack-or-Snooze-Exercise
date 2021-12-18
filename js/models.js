"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {  
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }
  getHostName() {
    return new URL(this.url).host; // new URL creates and returns a URL object .host will give us the host of the url
  }
}

/* We will create an object by using constructor, and in this object there will be a 
/*storyId, title, author, url, username, createdAt so when someone posts a story it will have these features.
/*this.storyId=storyId adds a property storyId to this(the empty object) and assigns it a value of storyId.
*/

/*
/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
   */

  static async getStories() {  //static class methods are defined on the class itself.You cannot call a static method on an object, only on an object class
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });
    const stories = response.data.stories.map(story => new Story(story)); // turn plain old story objects from API into instances of Story class
    return new StoryList(stories); // build an instance of our own class using the new array of stories
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory( user,{title,author,url}) {
    const token=user.loginToken;
    const response=await axios({
      method:"POST",
      url:  `${BASE_URL}.stories`,
      data:{token,story:{title,author,url}},
    });
    const story=new Story(response.data.story);
    this.stories.unshift(story);
    user.ownStories.unshift(story);

    return story;
  }


async removeStory(user,storyId){
  const token=user.loginToken;
  await axios ({
    url:  `${BASE_URL}/stories/${storyId}`,
    method:"DELETE",
    data:{token:user.loginToken}
  });
  this.stories=this.stories.filter(story => story.storyId !==storyId); // filter out the story whose ID we are removing
  user.ownStories=user.ownStories.filter(s => s.storyId !==storyId); // filter out the user's list of stories
  user.favorites=user.favorites.filter(s=>s.storyId !== storyId);  // filter out their favorites
  }
}

class User {
  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;  /** Make user instance from obj of user data and a token:{username, name, createdAt, favorites[], ownStories[]}*/

   
    this.favorites = favorites.map(s => new Story(s)); /*instantiate Story instances for the user's favorites and ownStories*/
    this.ownStories = ownStories.map(s => new Story(s));
    this.loginToken = token;// store the login token on the user so it's easy to find for API calls.
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.
   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
}
async function addFavorite(story){
  this.favorites.push(story);
  await this._addOrRemoveFavorite("add", story);
}

async function removeFavorite(story){
  this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
  await this._addOrRemoveFavorite("remove", story);
}

async function _addOrRemoveFavorite(newState,story){
  const method = newState ==="add" ? "POST" : "DELETE";
  const token = this.loginToken;
  await axios ({
    url:  `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
    method: method,
    data: {token},
  });
}

 function isFavorite(story){
  return this.favorites.some(s => (s.storyId === story.storyId));
}
