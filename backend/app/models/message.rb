class Message < ApplicationRecord
  belongs_to :care_receiver
  belongs_to :caregiver
end
