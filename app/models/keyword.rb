class Keyword < ActiveRecord::Base
  attr_accessible :item_user_id, :name

  belongs_to :item_user

  validates :name, presence: true

  def self.saveKeywords(id, keywords)
    tags = keywords.split(',')
    keywords = []
    tags.each do |tag|
      keyword = Keyword.create(name: tag.strip, item_user_id: id)
      new_tag = { name: keyword.name, id: keyword.id }
      keywords.push(new_tag)
    end
    keywords
  end

  def self.deleteKeyword(params)
    Keyword.find(params[:id]).delete
  end
end
