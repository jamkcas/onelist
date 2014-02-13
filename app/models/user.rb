class User < ActiveRecord::Base
  has_secure_password

  attr_accessible :auth_token, :email, :password, :password_confirmation, :username

  has_many :item_users
  has_many :items, through: :item_users

  validates :email, presence: true, uniqueness: true

  # Making sure an auth_token is generated and assigned to the user before saved
  before_create { generate_token(:auth_token) }

  def generate_token(column)
    # Assigning a unique random auth token
    begin
      self[column] = SecureRandom.urlsafe_base64
    end while User.exists?(column => self[column])
  end

  def self.update_user(params, current_user)
    if params[:data][:username]
      user = current_user.update_attributes(username: params[:data][:username])
      response = user ? { username: current_user.username.capitalize } : { errors: 'generic' }
    end

    if params[:data][:email]
      user = current_user.update_attributes(email: params[:data][:email])
      response = user ? { email: current_user.email } : { errors: 'email' }
    end

    if params[:data][:old_password]
      if current_user.authenticate(params[:data][:old_password])
        user = current_user.update_attributes(password: params[:data][:new_password])
        response = user ? 'Updated' : { errors: 'newPW' }
      else
        response = { errors: 'oldPW'}
      end
    end

    response
  end
end
