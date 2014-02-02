class UsersController < ApplicationController
  def create
    response = User.saveUser(params, session)

    render json: response
  end
end