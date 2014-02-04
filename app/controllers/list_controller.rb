class ListController < ApplicationController
  # before_filter :authorize, only: [:getItems]

  include SessionHelper

  def index
    # Setting the current user name if one exists(from SessionHelper)
    find_current_user
  end

  def getItems
    items = Item.all

    render json: items
  end
end
