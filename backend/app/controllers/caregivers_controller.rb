class CaregiversController < ApplicationController

  # Return back all caregivers
  def index
    caregivers = Caregiver.all
    render json: caregivers
  end

  # Create a primary caregiver on registration using inputs user entered, send back new primary caregiver if valid, if not send back errors
  def create_primary
    
    new_caregiver = Caregiver.create(caregiver_params);

    caregiver_with_photo = {
      care_receiver_id: new_caregiver.care_receiver_id,
      email: new_caregiver.email,
      id: new_caregiver.id,
      level: new_caregiver.level,
      name: new_caregiver.name,
      role: new_caregiver.role,
      username: new_caregiver.username, 
      photo_url: false
    }

    if new_caregiver.valid?
      render json: caregiver_with_photo
    else
      render json: new_caregiver.errors.full_messages
    end
  end

  # Find the caregiver by the username and email the user entered, if found, return the caregiver, otherwise, return error
  def login
    caregiver_found = Caregiver.find_by(username: params[:username], email: params[:email])
    
    if caregiver_found
      caregiver_found_with_photo = {
        care_receiver_id: caregiver_found.care_receiver_id,
        email: caregiver_found.email,
        id: caregiver_found.id,
        level: caregiver_found.level,
        name: caregiver_found.name,
        role: caregiver_found.role,
        username: caregiver_found.username, 
        photo_url: false
      }

      if caregiver_found.photo.attached?
        caregiver_found_with_photo[:photo_url] = url_for(caregiver_found.photo)
      end

      render json: caregiver_found_with_photo
    else
      render json: ["Invalid and/or email"]
    end
  end

  # Edit a caregiver's info, if caregiver is not valid with updated info, send back errors, otherwise send back the caregiver object
  def edit
    caregiver_found = Caregiver.find_by(id: params[:id])
    caregiver_found.update(caregiver_params)

    caregiver_found_with_photo = {
      care_receiver_id: caregiver_found.care_receiver_id,
      email: caregiver_found.email,
      id: caregiver_found.id,
      level: caregiver_found.level,
      name: caregiver_found.name,
      role: caregiver_found.role,
      username: caregiver_found.username, 
      photo_url: false
    }

    if caregiver_found.photo.attached?
      caregiver_found_with_photo[:photo_url] = url_for(caregiver_found.photo)
    end
    
    if caregiver_found.valid?
      render json: caregiver_found_with_photo
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

  def upload_photo
    caregiver = Caregiver.find_by(id:params[:id])

    caregiver.update(photo: params[:photo])

    render json: {photo_url: url_for(caregiver.photo)}
  end


  def upload_document
    new_document = Document.create(upload_document_params)
    
    new_document.update(document:params[:document])
    document_url = url_for(new_document.document)
    render json: {id: new_document.id,title: new_document.title, description: new_document.description, privacy: new_document.privacy, document: url_for(new_document.document), author: new_document.caregiver.name, created_at: new_document.created_at}
  end

  def care_receiver_documents
  care_receiver_found = CareReceiver.find_by(id: params[:id])
  all_documents = care_receiver_found.documents.map do |document|
    
      {id: document.id, title: document.title, description: document.description, privacy: document.privacy, document: url_for(document.document), author: document.caregiver.name, created_at: document.created_at}
    end
    render json: all_documents
  end


  private
  def caregiver_params
    params.permit(:name, :username, :email, :role, :level, :care_receiver_id)
  end

  def upload_document_params
    params.permit(:title, :description,:privacy, :caregiver_id)
  end
end