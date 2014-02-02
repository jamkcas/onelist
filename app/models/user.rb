class User < ActiveRecord::Base
  has_secure_password

  attr_accessible :auth_token, :email, :password, :password_confirmation, :username

  validates :email, presence: true, uniqueness: true
end
