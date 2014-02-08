Onelist::Application.routes.draw do

  root :to => 'items#index'
  get '/getIncomplete', to: 'items#getIncomplete'
  get '/getComplete', to: 'items#getComplete'
  post '/saveItem', to: 'items#saveItem'
  put '/changeStatus', to: 'items#changeStatus'
  get '/getItem/:header/:id', to: 'items#getItem'
  put '/updateItem', to: 'items#updateItem'

  resources :users, only: [:create, :update]
  resources :sessions, only: [:create, :destroy]
end
