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
    Item.switchStatus(params) if current_user

    render text: 'Updated'
  end

  def updateItem
    p ('*') * 50
    p params[:data][:due_date]
    response = Item.changeItem(params, current_user) if current_user

    render json: response
  end

  def deleteKeyword
    Keyword.deleteKeyword(params) if current_user

    render text: 'Deleted'
  end
end
