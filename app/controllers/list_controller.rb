class ListController < ApplicationController
  def index

  end

  def getItems
    items = Item.all

    render json: items
  end
end
