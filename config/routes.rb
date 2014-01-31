Onelist::Application.routes.draw do

  root :to => 'list#index'
  get '/items', to: 'list#getItems'

end
