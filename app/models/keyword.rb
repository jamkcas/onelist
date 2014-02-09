class Keyword < ActiveRecord::Base
  attr_accessible :item_user_id, :name

  belongs_to :item_user

  validates :name, presence: true

  def self.saveKeywords(id, keywords)
    tags = keywords.split(',')
    tags.each do |tag|
      Keyword.create(name: tag.strip, item_user_id: id)
    end
    tags
  end

  def self.deleteKeyword(params, current_user)
    id = current_user.item_users.where(item_id: params[:id])[0]
    ItemUser.find(id).keywords.where(name: params[:keyword])[0].delete
  end
end
