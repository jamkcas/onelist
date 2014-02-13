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
    # Finding all the item user entries associated with current_user
    itemUsers = current_user.item_users
    # Going through each item user entry and checking to see if it includes the current label being searched
    itemUsers.each do |item|
      status = false
      item.keywords.each do |keyword|
        # If the keyword equals the query then the keyword id is pushed into the keywordIds array and status is set to true
        if keyword.name == params[:label]
          status = true
          keywordIds.push(keyword.id)
        end
      end
      # If status is true, then the Item user entry is deleted and the Item Id is pushed into the itemIds array
      if status
        itemIds.push(item.item_id)
        ItemUser.find(item.id).delete
      end
    end
    # Deleteing all the Items associated with item user that contain the query label
    Item.deleteItems(itemIds)
    # Deleting all the keyword entries associated with the deleted items users
    Keyword.deleteKeywords(keywordIds)
  end
end
