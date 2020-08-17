class Caregiver < ApplicationRecord
  # has_many :documents
  belongs_to :care_receiver, optional: true
  has_many :comments, :foreign_key => 'commenter_id'
  has_many :posts, :foreign_key => 'author_id'
  has_many :acknowledgments
  has_many :documents

  # Validations for sign up
  validates :username, uniqueness: true, presence: true
  validates :email, uniqueness: true, presence: true
  validates :name, presence: true
  validates :role, presence: true
  validates :level, presence: true
end