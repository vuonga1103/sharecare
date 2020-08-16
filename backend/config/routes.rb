Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/caregivers', to: 'caregivers#index'
  post '/caregivers', to: 'caregivers#create_primary'
  post '/care-receivers', to: 'care_receivers#create'
  post '/caregivers/login', to: 'caregivers#login'
  get '/care-receivers/:id/posts', to: 'care_receivers#posts'
  get '/care-receivers/:id/important_posts', to: 'care_receivers#important_posts'
  get '/care-receivers/:id/my_caregivers', to: 'care_receivers#my_caregivers'
  post '/posts', to: 'posts#create'
  post '/acknowledgments', to: 'acknowledgments#create'
  post '/acknowledgments/delete', to: 'acknowledgments#destroy'
  get '/posts/:id/acknowledgers', to: 'posts#acknowledgers'
  get '/care_receivers/:id', to: 'care_receivers#show'
end