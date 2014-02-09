class CreateKeywords < ActiveRecord::Migration
  def change
    create_table :keywords do |t|
      t.integer :item_user_id
      t.string :name

      t.timestamps
    end
  end
end
