class ItemsController < ApplicationController
  # before_filter :authorize, only: [:getItems]

  include SessionHelper

  def index
    # Setting the current user name if one exists(from SessionHelper)
    find_current_user
  end

  def getIncomplete
    items = Item.fetchIncomplete(current_user) if current_user

    render json: items
  end

  def getComplete
    items = Item.fetchComplete(current_user) if current_user

    render json: items
  end

  def saveItem
    response = Item.saveNewItem(params[:title], current_user) if current_user

    render json: response
  end

  def changeStatus
    Item.updateItem(params) if current_user

    render text: 'Updated'
  end

  def getItem
    response = current_user && params[:header] == 'ajax request' ? Item.fetchItem(params[:id]) : 'Access Forbidden'

    render json: response
  end
end
