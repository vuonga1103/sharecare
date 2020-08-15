class Post < ApplicationRecord
  has_many :comments
  has_many :acknowledgments
  belongs_to :author, :class_name => "Caregiver"

  # Ensuring that on submission, user inputted title and content 
  validates :title, presence: true
  validates :content, presence: true
end
