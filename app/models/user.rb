class User < ActiveRecord::Base
  has_secure_password

  attr_accessible :auth_token, :email, :password, :password_confirmation, :username

  has_many :item_users
  has_many :items, through: :item_users

  validates :email, presence: true, uniqueness: true

  # Making sure an auth_token is generated and assigned to the user before saved
  before_save { generate_token(:auth_token) }

  def generate_token(column)
    # Assigning a unique random auth token
    begin
      self[column] = SecureRandom.urlsafe_base64
    end while User.exists?(column => self[column])
  end
end
