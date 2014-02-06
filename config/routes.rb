Onelist::Application.routes.draw do

  root :to => 'items#index'
  get '/getIncomplete', to: 'items#getIncomplete'
  get '/getComplete', to: 'items#getComplete'
  post '/saveItem', to: 'items#saveItem'
  put '/changeStatus', to: 'items#changeStatus'

  resources :users, only: [:create, :update]
  resources :sessions, only: [:create, :destroy]
end
