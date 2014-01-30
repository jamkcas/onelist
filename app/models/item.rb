class Item < ActiveRecord::Base
  attr_accessible :complete, :due_date, :image, :note, :reminder, :title
end
