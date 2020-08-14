class CreateAcknowledgments < ActiveRecord::Migration[6.0]
  def change
    create_table :acknowledgments do |t|
      t.integer :caregiver_id
      t.integer :post_id

      t.timestamps
    end
  end
end
