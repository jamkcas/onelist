class ItemUser < ActiveRecord::Base
  attr_accessible :creator, :item_id, :user_id

  belongs_to :item
  belongs_to :user

  def self.saveItemUser(current_id, item_id, creator)
    ItemUser.create(user_id: current_id, item_id: item_id, creator: creator)
  end
end
