Onelist::Application.routes.draw do

  root :to => 'list#index'
  get '/items', to: 'list#getItems'

  resources :users, only: [:create, :update]
end
