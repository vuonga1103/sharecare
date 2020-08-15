class CreateCaregivers < ActiveRecord::Migration[6.0]
  def change
    create_table :caregivers do |t|
      t.string :name
      t.string :username
      t.string :email
      t.integer :care_receiver_id, null: true
      t.string :role
      t.string :level

      t.timestamps
    end
  end
end
