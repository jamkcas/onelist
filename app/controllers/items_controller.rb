class ItemsController < ApplicationController

  include SessionHelper

  def index
    # Setting the current user name if one exists(from SessionHelper)
    find_current_user
  end

  def getIncomplete
    p ('*') * 50
    p 'here'
    response = (current_user && (params[:data] == 'This is an ajax request')) ? Item.fetchIncomplete(current_user) : 'Access Forbidden'


    render json: response
  end

  def getComplete
    response = (current_user && (params[:data] == 'This is an ajax request')) ? Item.fetchComplete(current_user) : 'Access Forbidden'

    render json: response
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
    response = Item.changeItem(params, current_user) if current_user

    render json: response
  end

  def deleteKeyword
    Keyword.deleteKeyword(params[:id]) if current_user

    render text: 'Deleted'
  end

  def deleteItem
    Item.deleteItem(params[:id]) if current_user
    ItemUser.deleteItem(params, current_user) if current_user

    render text: 'Deleted'
  end

  def deleteLabel
    ItemUser.deleteLabel(current_user, params)

    render text: 'Deleted'
  end
end
