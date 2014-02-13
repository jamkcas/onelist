class UsersController < ApplicationController
  include SessionHelper

  def create
    # Creating a new user
    user = User.new(params[:user])

    # Preparing a response
    response = {}
    # If the user is successfully saved, the session user_id is set to the new user's id and a welcome notice is returned, else an error notice is returned
    if user.save
      session[:user_id] = user.id
      sign_in(user.email, user.password_digest)
      response[:notice] = user.username.capitalize
    else
      response[:notice] = 'Sorry, we were unable to process your sign up request.'
    end

    # If errors exist an error array is returned
    response[:errors] = user.errors.full_messages if user.errors

    render json: response
  end

  def updateUser
    response = User.update_user(params, current_user) if current_user

    render json: response
  end
end