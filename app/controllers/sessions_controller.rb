class SessionsController < ApplicationController
  include SessionHelper

  def create
    response = sign_in(params[:user][:password], params[:user][:password], params[:user][:remember])

    render json: response
  end

  def destroy
    cookies.delete(:auth_token)
    gon.current_user = ''

    redirect_to '#/login'
  end
end