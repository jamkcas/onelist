class CreateItemUsers < ActiveRecord::Migration
  def change
    create_table :item_users do |t|
      t.integer :user_id
      t.integer :item_id
      t.boolean :creator

      t.timestamps
    end
  end
end
