class Keyword < ActiveRecord::Base
  attr_accessible :item_user_id, :name

  belongs_to :item_user

  validates :name, presence: true

  def self.saveKeywords(id, keywords)
    # Splitting the keyword string into an array of keywords
    tags = keywords.split(',')
    tag_names = []
    tag_ids = []
    # Saving the keywords and preparing keyword and keyword id arrays to be returned
    tags.each do |tag|
      keyword = Keyword.create(name: tag.strip, item_user_id: id)
      tag_names.push(keyword.name)
      tag_ids.push(keyword.id)
    end
    # Returning an array with keywords and ids arrays
    keywords = [tag_names, tag_ids]
  end

  def self.deleteKeyword(id)
    Keyword.find(id).delete
  end

  def self.deleteKeywords(keywordIds)
    keywordIds.each do |id|
      Keyword.deleteKeyword(id)
    end
  end
end
