class CareReceiver < ApplicationRecord
  has_many :caregivers
  has_many :posts, through: :caregivers

  # At minimal, caregiver should enter carereceiver's name on registration
  validates :name, presence: true
end
