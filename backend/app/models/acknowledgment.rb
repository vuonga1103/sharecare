class Acknowledgment < ApplicationRecord
  belongs_to :post
  belongs_to :caregiver
end
