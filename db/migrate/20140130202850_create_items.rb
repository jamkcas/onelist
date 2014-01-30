class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.string :title
      t.text :note
      t.string :due_date
      t.boolean :complete
      t.string :image
      t.string :reminder

      t.timestamps
    end
  end
end
