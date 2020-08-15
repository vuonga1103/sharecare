class CareReceiver < ApplicationRecord
  has_many :caregivers

  # At minimal, caregiver should enter carereceiver's name on registration
  validates :name, presence: true
end
