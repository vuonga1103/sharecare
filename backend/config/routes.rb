Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/caregivers', to: 'caregivers#index'
  post '/caregivers', to: 'caregivers#create_primary'
  post '/care-receivers', to: 'care_receivers#create'
  post '/caregivers/login', to: 'caregivers#login'
  get '/care-receivers/:id/posts', to: 'care_receivers#posts'
  post '/posts', to: 'posts#create'
end