class Item < ActiveRecord::Base
  attr_accessible :complete, :due_date, :image, :note, :reminder, :title

  has_many :item_users
  has_many :users, through: :item_users

  validates :title, presence: true

  def self.saveNewItem(params, current_user)
    item = Item.create(title: params)

    response = {}
    if item.save
      itemUsers = ItemUser.saveItemUser(current_user.id, item.id, true)
      response[:errors] = itemUsers.errors if !itemUsers.save
      response[:item] = item if itemUsers.save
    else
      response[:errors] = item.errors
    end

    return response
  end

  def self.fetchIncomplete(current_user)
    items = current_user.items.where(complete: false).reverse
  end

  def self.fetchComplete(current_user)
    items = current_user.items.where(complete: true).reverse
  end

  def self.updateItem(params)
    Item.find(params[:data][:item_id]).update_attributes(complete: params[:data][:complete])
  end
end
