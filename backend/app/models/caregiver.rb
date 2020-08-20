class Caregiver < ApplicationRecord
  # has_many :documents
  belongs_to :care_receiver, optional: true
  has_many :comments, :foreign_key => 'commenter_id', dependent: :destroy 
  has_many :posts, :foreign_key => 'author_id', dependent: :destroy
  has_many :acknowledgments, dependent: :destroy
  has_many :documents, dependent: :destroy
  has_one_attached :photo, dependent: :destroy

  # Validations for sign up
  validates :username, uniqueness: true, presence: true
  validates :email, uniqueness: true, presence: true
  validates :name, presence: true
  validates :role, presence: true
  validates :level, presence: true
end