Rails.application.routes.draw do
  resources :documents
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  # /CAREGIVERS ROUTES
  get '/caregivers', to: 'caregivers#index'
  post '/caregivers', to: 'caregivers#create_primary'
  post '/caregivers/login', to: 'caregivers#login'
  patch '/caregivers/:id', to: 'caregivers#edit'
  delete '/caregivers/:id', to: 'caregivers#destroy'
  post '/caregivers/upload_document', to: 'caregivers#upload_document'
  delete '/documents/:id', to: 'documents#destroy'
  get 'caregivers/:id/care_receiver_documents', to: 'caregivers#care_receiver_documents'
  post '/caregivers/:id/upload_photo', to: 'caregivers#upload_photo'


  # /CARE-RECEIVERS ROUTES
  post '/care-receivers', to: 'care_receivers#create'
  get '/care_receivers/:id', to: 'care_receivers#show'
  get '/care-receivers/:id/posts', to: 'care_receivers#posts'
  get '/care-receivers/:id/important_posts', to: 'care_receivers#important_posts'
  get '/care-receivers/:id/my_caregivers', to: 'care_receivers#my_caregivers'
  
  # /POSTS ROUTES
  post '/posts', to: 'posts#create'
  get '/posts/:id/acknowledgers', to: 'posts#acknowledgers'
  get '/posts/:id', to: 'posts#show'
  get '/posts/:id/comments', to: 'posts#comments'
  patch '/posts/:id', to: 'posts#edit'
  patch '/posts/priority/:id', to: 'posts#priority_update'
  delete '/posts/:id', to: 'posts#destroy'

  # /ACKNOWLEDGMENTS ROUTES
  post '/acknowledgments', to: 'acknowledgments#create'
  post '/acknowledgments/delete', to: 'acknowledgments#destroy'
  
  # /COMMENTS ROUTES
  post '/comments', to: 'comments#create'
  delete '/comments/:id', to: 'comments#destroy'
end