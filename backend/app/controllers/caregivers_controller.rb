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


  private
  def caregiver_params
    params.permit(:name, :username, :email, :role, :level, :care_receiver_id)
  end
end