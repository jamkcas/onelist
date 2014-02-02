class ListController < ApplicationController
  before_filter :authorize, only: [:getItems]
  def index

  end

  def getItems
    items = Item.all

    render json: items
  end
end
