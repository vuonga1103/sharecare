class Caregiver < ApplicationRecord
  # has_many :documents
  belongs_to :care_receiver
  has_many :comments, :foreign_key => 'commenter_id'
  has_many :posts, :foreign_key => 'author_id'
  has_many :acknowledgments
end