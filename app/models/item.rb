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

  def self.createHash(current_user, items)
    itemsHash = []
    items.each do |item|
      newItem = {}
      id = current_user.item_users.where(item_id: item.id)[0]

      tags = Keyword.find_all_by_item_user_id(id)
      keywords = []
      tags.each do |tag|
        new_tag = { name: tag.name, id: tag.id }
        keywords.push(new_tag)
      end

      newItem[:id] = item.id
      newItem[:keywords] = keywords
      newItem[:title] = item.title
      newItem[:complete] = item.complete
      newItem[:notes] = item.note
      newItem[:due_date] = item.due_date
      newItem[:updated_at] = item.updated_at
      newItem[:created_at] = item.created_at
      itemsHash.push(newItem)
    end
    itemsHash
  end

  def self.fetchIncomplete(current_user)
    items = current_user.items.where(complete: false).reverse
    itemsHash = self.createHash(current_user, items)
  end

  def self.fetchComplete(current_user)
    items = current_user.items.where(complete: true).reverse
    itemsHash = self.createHash(current_user, items)
  end

  def self.switchStatus(params)
    Item.find(params[:data][:item_id]).update_attributes(complete: params[:data][:complete])
  end

  def self.changeItem(params, current_user)
    Item.find(params[:data][:id]).update_attributes(title: params[:data][:title]) if params[:data][:title]
    Item.find(params[:data][:id]).update_attributes(note: params[:data][:note]) if params[:data][:note]
    Item.find(params[:data][:id]).update_attributes(due_date: params[:data][:due_date]) if params[:data][:due_date]

    if params[:data][:keywords]
      id = current_user.item_users.where(item_id: params[:data][:id])[0].id
      keywords = Keyword.saveKeywords(id, params[:data][:keywords])
    end

    response = params[:data][:keywords] ? keywords : 'Updated'
  end
end
