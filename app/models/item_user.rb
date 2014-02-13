class ItemUser < ActiveRecord::Base
  attr_accessible :creator, :item_id, :user_id

  belongs_to :item
  belongs_to :user
  has_many :keywords

  def self.saveItemUser(current_id, item_id, creator)
    ItemUser.create(user_id: current_id, item_id: item_id, creator: creator)
  end

  def self.deleteItem(params, current_user)
    deleteItemUser = current_user.item_users.where(item_id: params[:id])
  end

  def self.deleteLabel(current_user, params)
    itemIds = []
    keywordIds = []
    itemUsers = current_user.item_users
    itemUsers.each do |item|
      status = false
      item.keywords.each do |keyword|
        if keyword.name == params[:label]
          status = true
          keywordIds.push(keyword.id)
        end
      end
      if status
        itemIds.push(item.item_id)
        ItemUser.find(item.id).delete
      end
    end

    Item.deleteItems(itemIds)
    Keyword.deleteKeywords(keywordIds)
  end
end
