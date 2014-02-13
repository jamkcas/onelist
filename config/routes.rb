Onelist::Application.routes.draw do

  root :to => 'items#index'
  get '/getIncomplete/:data', to: 'items#getIncomplete'
  get '/getComplete/:data', to: 'items#getComplete'
  post '/saveItem', to: 'items#saveItem'
  put '/changeStatus', to: 'items#changeStatus'
  put '/updateItem', to: 'items#updateItem'
  delete '/deleteKeyword/:id', to: 'items#deleteKeyword'

  resources :users, only: [:create, :update]
  put '/updateUser', to: 'users#updateUser'
  resources :sessions, only: [:create, :destroy]
end
