class Document < ApplicationRecord
  belongs_to :caregiver
  has_one_attached :document




  def document_url
    url_for(self.document)
  end
end
