module SessionHelper
  def sign_in(params)
    # Finding the user by the email entered
    user = User.find_by_email(params[:user][:email])
    # Preparing a response
    response = '';
    # Checking to see if the user exists and if the password entered was correct
    if user and user.authenticate(params[:user][:password])
      # Checking to see if the user wanted to be remembered and creating a permanent cookie if so, otherwise creating a temporary one
      if params[:user][:remember]
        cookies.permanent[:auth_token] = user.auth_token
      else
        cookies[:auth_token] = { value: user.auth_token, expires: Time.now + 3600 }
      end
      # Preparing a response of the user's name
      response = user.username.capitalize
    else
      # Preparing an error response
      response = "Invalid email or password."
    end
    # Returning the response
    response
  end

  def find_current_user
    # Setting the current user's name for welcome message if there is a current user
    if current_user
      gon.current_user = current_user.username.capitalize
    else
      gon.current_user = ''
    end
  end
end