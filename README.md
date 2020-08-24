# Twitter User Lookup, Followers/ing, & Trends


## About

This Node.js webapp was created to access and display information from Twitter using the Twitter API. There are 3 main functionalities:
1. **user lookup for basic user information** (username/handle, follower/following count, likes/tweets count, profile/banner picture, verified status, location, description/urls, and a link to the user's page on Twitter.
2. **user lookup for a display of the total count and names of the mutual and nonmutual followers.** Mutual is defined when both the entry user is following the other user and is followed by the other user. Nonmutual is when either of those conditions are not met.
3. **trends lookup for any location** (worldwide, country, city) in the world as represented in the Where On Earth ID (woeid) list. Entries can be typed by both the location's name as well as the specific woeid number (for cases in which the user is not able to type out the name or certain characters)


## Authentication & Postman

This project utilizes application-only authentication using the OAuth 2.0 Bearer Token. Authentication does not involve any user and is only involved with the app for read-only permissions of Twitter data.

As described in the Twitter Developer docs, the API ConsumerKey and ConsumerSecret were generated by Twitter upon creation of the project. They were then URL encoded using RFC 1738 (did not change the keys' value at this point). The keys were then concatenated and again encoded using Base64.

To obtain the Bearer token, the [Postman Desktop Agent](https://blog.postman.com/introducing-the-postman-agent-send-api-requests-from-your-browser-without-limits/#:~:text=The%20Postman%20agent%20is%20a,API%20calls%20on%20your%20behalf.&text=The%20first%20time%20you%20visit,agent%20for%20your%20operating%20system.) was used. A HTTP POST request was sent to https://api.twitter.com/oauth2/token with the Authorization header defining the Base64 encoded string. The Twitter server then responded with a JSON object containing the token_type (bearer) and the access_token (bearer key). Then, to authenticate API requests with the token, a HTTP GET request was sent to https://api.twitter.com//1.1/statuses/user_timeline.json?count=100&screen_name=twitterap with the Authorization header defining the Bearer Token. 

After that, the tokens were assigned to the environment variables TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, and TWITTER_BEARER_TOKEN respectively in order to create a *client* object using the Node *twitter* module containing the keys that will be used in GET requests to the API. The keys are assigned in the gitignored .env file as well as provided as Config Variables to Heroku to preserve security.



## Accessing Twitter API & Endpoints

***NOTE: This project uses the Twitter API v1.1 endpoints. Twitter is in early access of and will migrate to v2 endpoints.***

Base url for all GET requests is https://api.twitter.com/1.1/[endpoint/endpoint], where the endpoints are indicated below.


### User Lookup
 
For User Lookup, a POST request was used to get the input as the request parameter and then a GET request was sent to **users/lookup** with parameter {screen_name : input}, where screen_name is the Twitter handle @. The response JSON data recieved is a *user object*:
- *data[0].* name, screen_name, location, description, url, followers_count, friends_count, favourites_count, statuses_count, verified, profile_image_url_https, profile_banner_url


### User Followers/ing

For User Followers/ing, a POST request was used to get the input as the request parameter and then a GET request was sent to **friends/list** and **followers/list**  using Async/Await and Promises with paramaters {screen_name : screenName, cursor : cur, count: 200}, where screen_name is the Twitter handle @, cursor is the current cursor that contains a list of followers/following, with a max of count = 200. The response JSON data recieved is a *cursored collection of user objects*:
- *users.screen_name* is pushed for each user object according to the functions and limits. The followers/following lists are then filtered to obtain the mutual and nonmutual users.


### Trends

For the Worldwide trends, the client object sends a GET request to **trends/place** with parameter {id : location}, where the id is a woeid and location = 1 for worldwide. The response JSON data recieved is an array of *trends objects*:
- *tweets[0].trends*, which was then passed to *index.handlebars* where a For-Each loop gathered the trend. name, url, and volume.
- *tweets[0].locations[0].name*, which is a String of the location.

A similar method for the trends was used in the trends lookup except a POST request was used to get the request parameter and then filter it through the JSON data in *trends_locations.js* to find the location by its name or woeid, and also return the woeid. A GET request was then sent with the parameter {id : woeid}.


## Limits & Errors

Since this project uses the Standard API, there are rate limits to all GET Endpoints.

- User Lookup: 3000 requests/15 minutes
- User Followers/ing: 15 requests/15 minutes 
- Trends: 75 requests/15 minutes

Especially for User Followers/ing since each response is cursored and includes a max of 200 users, there is a very short limit to the amount of requests the app can perform, even with setting a cap of a maximum of 5 requests (1000 users) for each lookup of followers and following.

Errors may occur if:
- the entry of a user or location is invalid 
- the rate limit for any endpoint/functionality is reached


## Info/Dependencies
Dependencies found in *package.json* and *package-lock.json*

Created using Node.js (along with the express, express-handlebars, and twitter modules).
CSS using the Bootstrap CDN

Hosted on Heroku, using the Heroku CLI




## Useful Resources
- Twitter API: [twitter](https://developer.twitter.com/en/docs)
- Node/Express: [node](https://www.youtube.com/watch?v=fBNz5xF-Kx4&list=PLrqKr-xuh9fc2M5R8sOOXc4efwT4wd4fN&index=1), [express](https://www.youtube.com/watch?v=L72fhGm1tfE&list=PLrqKr-xuh9fc2M5R8sOOXc4efwT4wd4fN&index=2)
- Obtaining authentication, Postman, GET: [medium](https://medium.com/@federicojordn/simplertapp-twitter-search-api-with-node-js-29e4664db299), [stack overflow](https://stackoverflow.com/questions/45078952/twitter-api-application-only-authentication)
- Handling asynchronous data and cursoring: [stack overflow](https://stackoverflow.com/questions/28008897/node-js-twitter-api-cursors)
- WoeID information: [nations24](https://nations24.com/)
- JSON location data (*trends_locations.js*): [codebeautify](https://codebeautify.org/jsonviewer/cbe97376)

