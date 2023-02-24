<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

A social media app using MERN stack, has a responsive design, easy to use, with common feature from other social media apps for better scalability, a chat system and other features.

Pick = Post
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


### Main features:
* [x] Creating an account
	* [x] Sign Up
	* [x] Login
	* [x] Delete Account
	* [x] Update Account
* [ ] Posting a pick
	* [ ] Include attachment: Image, location, Video and Text
	* [ ] Edit pick
	* [ ] Delete pick
* [x] Adding friends
	* [x] delete friend
	* [x] Follow up
	* [ ] Receiving picks from friends
* [x] Creating groups
	* [x] Private or Public
	* [ ] Adding other users to the group (link for invite in case of private)
	* [x] Posting in groups


### Next features:
* [ ] Groups:
	* [ ] Adding voting pools
* [ ] Stories (a post with timer)
* [ ] Chat
* [ ] Group Chat
* [ ] Events

### Data Base Schemas:
|Pick| |
|-|-|
|id|string|
|user|User|
|group|Group|
|content|string|
|likes|number|
|comment|Comment[]|
|created_at|Date|
|updated_at|Date|
* [x] create pick
* [ ] get one pick
* [ ] get all picks from this user => User page
* [ ] get all picks from this group => Group page
* [ ] get all picks from all groups from this user=> Home page
* [ ] get all picks from all groups all users => random picks
* [ ] get all picks from this group from this user => specific picks
* [ ] update content
* [ ] update like +/-
* [ ] delete pick


|User| |
|-|-|
|id|string|
|username|string|
|email|string|
|password|string|
|followers|User[]|
|following|User[]|
|group|Group[]|
|total_likes|number| //{comment, pick}
|birth_date|Date|
|img|string|
|admin|boolean|
* [x] Sign Up
* [x] Sign In
* [x] get user
* [x] get all users
* [x] update user username
* [x] update user password
* [x] delete user
* [x] follow a user
* [x] unfollow a user
* [x] get all user following users
* [x] get all user followers users

* [ ] get user comments like
* [ ] get user picks likes

|Group| |
|-|-|
|id|string|
|title|string|
|description|string|
|type|enum(public, private)|
|tags|string TODO| 
|users|User[]|
|picks|Pick[]|
|img|string TODO|
|Rules| string TODO|
* [x] create group
* [x] get a group
* [x] get all groups
* [x] get all groups by search query
* [ ] get all groups by tags TODO
* [x] update group title (owner + admin)
* [x] update group description (owner + admin)
* [ ] change owner (owner)
* [x] change type (owner + admin)
* [x] add admin (owner)
* [x] remove admin (owner)
* [x] remove users (owner + admin)
* [ ] delete group (owner) 
	* [ ] delete all roles related to this group 
	* [ ] delete all picks in this group

* [x] join group
* [x] check if user joined this group
* [x] leave group
* [x] get all user groups
	* [ ] mark user deleted if not found


|Comment| |
|-|-|
|id|string|
|pick|Pick|
|user|User|
|content|string|
|like|number|
|comments|Comment[]|
* [ ] Create comment
* [ ] get all comments for one pick
