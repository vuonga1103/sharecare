class CreateMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :messages do |t|
      t.string :content
      t.integer :care_receiver_id
      t.integer :caregiver_id

      t.timestamps
    end
  end
end
