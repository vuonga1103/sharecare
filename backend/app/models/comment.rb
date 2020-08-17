class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :commenter, :class_name => "Caregiver"

  validates :content, presence: true
end


