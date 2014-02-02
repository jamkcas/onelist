class SessionsController < ApplicationController
  include SessionHelper

  def create
    response = sign_in(params)

    render json: response
  end

  def destroy
    cookies.delete(:auth_token)
    redirect_to '#/incomplete'
  end
end