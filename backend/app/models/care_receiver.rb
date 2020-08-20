class CareReceiver < ApplicationRecord
  has_many :caregivers
  has_many :posts, through: :caregivers
  has_many :documents, through: :caregivers
  has_one_attached :photo
  has_many :messages

  # At minimal, caregiver should enter carereceiver's name on registration
  validates :name, presence: true
end
