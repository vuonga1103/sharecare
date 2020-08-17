class CreateDocuments < ActiveRecord::Migration[6.0]
  def change
    create_table :documents do |t|
      t.string :title
      t.string :description
      t.string :privacy
      t.belongs_to :caregiver, null: false, foreign_key: true

      t.timestamps
    end
  end
end
