class CreateCareReceivers < ActiveRecord::Migration[6.0]
  def change
    create_table :care_receivers do |t|
      t.string :name
      t.integer :age
      t.string :allergies
      t.string :precautions
      t.text :bio

      t.timestamps
    end
  end
end
