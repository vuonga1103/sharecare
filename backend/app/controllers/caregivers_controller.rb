class CaregiversController < ApplicationController

  # Return back all caregivers
  def index
    caregivers = Caregiver.all
    render json: caregivers
  end

  # Create a primary caregiver on registration using inputs user entered, send back new primary caregiver if valid, if not send back errors
  def create_primary
    new_caregiver = Caregiver.create(caregiver_params)
    
    if new_caregiver.valid?
      render json: new_caregiver
    else
      render json: new_caregiver.errors.full_messages
    end
  end

  # Find the caregiver by the username and email the user entered, if found, return the caregiver, otherwise, return error
  def login
    caregiver_found = Caregiver.find_by(username: params[:username], email: params[:email])

    if caregiver_found
      render json: caregiver_found
    else
      render json: ["Invalid and/or email"]
    end
  end

  # Edit a caregiver's info, if caregiver is not valid with updated info, send back errors, otherwise send back the caregiver object
  def edit
    caregiver = Caregiver.find_by(id: params[:id])
    caregiver.update(caregiver_params)
    
    if caregiver.valid?
      render json: caregiver
    else
      render json: caregiver.errors.full_messages
    end
  end

  # Delete an instance of the caregiver and associated data
  def destroy
    caregiver = Caregiver.find_by(id: params[:id])
    caregiver.destroy
    render json: caregiver
  end
  def upload_document
    new_document = Document.create(upload_document_params)
    new_document.update(document:params[:document])
    render json: {image_url: url_for(new_document.document)}
  end

  def care_receiver_documents
  care_receiver_found = CareReceiver.find_by(id: params[:id])
  
  all_documents = care_receiver_found.documents.map do |document|
      {title: document.title, description: document.description, privacy: document.privacy, document: url_for(document.document), author: document.caregiver.name}
    end
    byebug
  end


  private
  def caregiver_params
    params.permit(:name, :username, :email, :role, :level, :care_receiver_id)
  end

  def upload_document_params
    params.permit(:title, :description,:privacy, :caregiver_id)
  end
end