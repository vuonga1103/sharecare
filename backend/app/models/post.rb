class Post < ApplicationRecord
  has_many :comments
  has_many :acknowledgments
  belongs_to :author, :class_name => "Caregiver"
end
