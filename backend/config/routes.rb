Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  # /CAREGIVERS ROUTES
  get '/caregivers', to: 'caregivers#index'
  post '/caregivers', to: 'caregivers#create_primary'
  post '/caregivers/login', to: 'caregivers#login'
  patch '/caregivers/:id', to: 'caregivers#edit'
  delete '/caregivers/:id', to: 'caregivers#destroy'

  # /CARE-RECEIVERS ROUTES
  post '/care-receivers', to: 'care_receivers#create'
  get '/care_receivers/:id', to: 'care_receivers#show'
  get '/care-receivers/:id/posts', to: 'care_receivers#posts'
  get '/care-receivers/:id/important_posts', to: 'care_receivers#important_posts'
  get '/care-receivers/:id/my_caregivers', to: 'care_receivers#my_caregivers'
  
  # /POSTS ROUTES
  post '/posts', to: 'posts#create'
  get '/posts/:id/acknowledgers', to: 'posts#acknowledgers'
  get '/posts/:id/comments', to: 'posts#comments'

  # /ACKNOWLEDGMENTS ROUTES
  post '/acknowledgments', to: 'acknowledgments#create'
  post '/acknowledgments/delete', to: 'acknowledgments#destroy'
  
  # /COMMENTS ROUTES
  post '/comments', to: 'comments#create'
  
end