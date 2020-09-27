# ShareCare

Check out a [brief demo](https://www.youtube.com/watch?v=smRN9G-rqIE&t).

Share care is a social platform that streamlines communication among caregivers who provide care for a common care receiver. Caregivers can create and acknowledge posts, upload profile photos and documents, and chat with one another in real-time. 

![ShareCare](https://i.ibb.co/j3znnY0/Screen-Shot-2020-09-27-at-12-04-54-PM.png)

# Getting Started

### Installing Backend
* Install [Homebrew](https://brew.sh/) 

  `$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`
* Install [Ruby](https://www.ruby-lang.org/en/) 

  `$ brew install ruby` 
* Install [Rails](https://rubyonrails.org/) 

  `$ gem install rails`
* Clone repo and cd into `sharecare/backend`
* Install dependencies

  `$ bundle install`
* Migrate and seed

  `$ rails db:migrate`  

  `$ rails db:seed`
* Start rails server

  `$ rails s`  
  
### Launching Frontend
* cd into `sharecare/frontend`
* Open html file in browser

  `$ open index.html`  
  
# Features

### Creating a Team
![Profile photo](https://im3.ezgif.com/tmp/ezgif-3-c20eba38de5a.gif)
![Add caregivers](https://im3.ezgif.com/tmp/ezgif-3-2a467206c504.gif )

* Add profile photo
* Add/remove secondary caregivers to team as a primary caregiver


### Posts
![Posts](https://im3.ezgif.com/tmp/ezgif-3-0a013965259b.gif )

* Create/edit/delete posts
* Set priority of posts via input or drag and drop


### Acknowledgments
![Acknowledgment](https://im3.ezgif.com/tmp/ezgif-3-8ebfee79a502.gif)

* Acknowledge posts written by other users


### Comments
![Comments](https://im3.ezgif.com/tmp/ezgif-3-fdb4d30c767d.gif)

* reate a new comment on a post or delete a comment

### Upload Documents
![Uploads](https://im3.ezgif.com/tmp/ezgif-3-d75ee3051117.gif)

* Upload document and store via Active Storage
* Delete uploaded documents
* As admin/primary caregiver, can set documents a private


### Group Chat
![Group Chat](https://im3.ezgif.com/tmp/ezgif-3-bd42a0cb787b.gif)

* Chat in real time with other users with use of Websocket

### Customization
![Customization](https://im3.ezgif.com/tmp/ezgif-3-56d12fe02952.gif)

* Customizing look via drag and drop

# Tech Stack
* Ruby on Rails
* SQLite3
* Custom HTML/CSS
* Active Record
* Active Storage
* Native Javascript
* Websocket

# Tools
* [Tingle](https://tingle.robinparisi.com)
* [SortableJS](https://github.com/SortableJS/sortablejs)
