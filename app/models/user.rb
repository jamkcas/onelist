class User < ActiveRecord::Base
  has_secure_password

  attr_accessible :auth_token, :email, :password, :password_confirmation, :username

  validates :email, presence: true, uniqueness: true

  # Making sure an auth_token is generated and assigned to the user before saved
  before_save { generate_token(:auth_token) }

  def generate_token(column)
    # Assigning a unique random auth token
    begin
      self[column] = SecureRandom.urlsafe_base64
    end while User.exists?(column => self[column])
  end

  def self.saveUser(params, session)
    # Creating a new user
    user = User.new(params[:user])

    # Preparing a response
    response = {}
    # If the user is successfully saved, the session user_id is set to the new user's id and a welcome notice is returned, else an error notice is returned
    if user.save
      session[:user_id] = user.id
      response[:notice] = 'Welcome, ' + user.username.capitalize
    else
      response[:notice] = 'Sorry, we were unable to process your sign up request.'
    end

    # If errors exist an error array is returned
    response[:errors] = user.errors.full_messages if user.errors
    # Returning the response
    response
  end
end
