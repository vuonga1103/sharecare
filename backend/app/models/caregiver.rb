class Caregiver < ApplicationRecord
  # has_many :documents
  belongs_to :care_receiver, optional: true
  has_many :comments, :foreign_key => 'commenter_id'
  has_many :posts, :foreign_key => 'author_id'
  has_many :acknowledgments

  # Validations for username/email
  validates :username, uniqueness: true
  validates :email, uniqueness: true
end