class UsersController < ApplicationController
  def create
    user = User.new(params[:user])

    response = {}
    response[:notice] = user.save ? 'Congratulations! You have successfully signed up.' : 'Sorry, we were unable to process your sign up request.'

    response[:errors] = user.errors.full_messages if user.errors

    render json: response
  end
end