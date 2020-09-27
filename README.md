# ShareCare

Check out a [brief demo](https://www.youtube.com/watch?v=smRN9G-rqIE&t).

Share care is a social platform that streamlines communication among caregivers who provide care for a common care receiver. Caregivers can create and acknowledge posts, upload profile photos and documents, and chat with one another in real-time. 

![ShareCare](https://i.ibb.co/j3znnY0/Screen-Shot-2020-09-27-at-12-04-54-PM.png)

## Table of Contents
* [Getting Started](#getting-started)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Tools](#tools)

<a name="getting-started"/>

## Getting Started
### Installing Backend
* Install [Homebrew](https://brew.sh/) 

  `$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`
* Install [Ruby](https://www.ruby-lang.org/en/) 

  `$ brew install ruby` 
* Install [Rails](https://rubyonrails.org/) 

  `$ gem install rails`
* Install [PostreSQL](https://www.postgresql.org/) 

  `$ brew install postgresql`
* Clone repo and cd into `sharecare/backend`
* Install dependencies

  `$ bundle install`
* Create migration, migrate and seed

    ```
    $ rails db:create
    $ rails db:migrate
    $ rails db:seed   
* Start rails server

  `$ rails s`  
  
### Launching Frontend
* cd into `sharecare/frontend`
* Open html file in browser

  `$ open index.html`  
 
<a name="features"/>

## Features

### Creating a Team
![Profile photo](https://media4.giphy.com/media/xYOoliohWEyInPa2e4/giphy.gif)
![Add caregivers](https://media1.giphy.com/media/u9us2NoEO78IXGF7wF/giphy.gif)

* Add profile photo
* Add/remove secondary caregivers to team as a primary caregiver


### Posts
![Posts](https://media4.giphy.com/media/RseUIesZMILXFLCIuK/giphy.gif)

* Create/edit/delete posts
* Set priority of posts via input or drag and drop


### Acknowledgments
![Acknowledgment](https://media0.giphy.com/media/6S2RHAlUFxlaSHmCjo/giphy.gif)

* Acknowledge posts written by other users


### Comments
![Comments](https://media3.giphy.com/media/aPjHknwlHlCbiNEddC/giphy.gif)

* Create a new comment on a post or delete a comment

### Upload Documents
![Uploads](https://media4.giphy.com/media/YTmtxTx43cgdXomBts/giphy.gif)

* Upload document and store via Active Storage
* Delete uploaded documents
* As admin/primary caregiver, can set documents as private


### Group Chat
![Group Chat](https://media1.giphy.com/media/pKjUiZHLAZ4dDNpZsV/giphy.gif)

* Chat in real time with other users with use of Websocket

### Customization
![Customization](https://media0.giphy.com/media/BGvjA9RCMqyRbjcoB7/giphy.gif)

* Customizing look via drag and drop

<a name="tech-stack"/>

## Tech Stack
* Ruby on Rails
* PostreSQL
* Custom HTML/CSS
* Active Record
* Active Storage
* Native Javascript
* Websocket

<a name="tools"/>

## Tools
* [Tingle](https://tingle.robinparisi.com)
* [SortableJS](https://github.com/SortableJS/sortablejs)
