class CareReceiversController < ApplicationController

  # Creates a new care receiver from info user entered on registration; if valid link the care receiver to the caregiver who registered, and return back the caregiver; otherwise return error
  def create
    new_care_receiver = CareReceiver.create(care_receiver_params)
    if new_care_receiver.valid? 
      caregiver = Caregiver.find(params[:caregiver_id])
      new_care_receiver.caregivers << caregiver
      new_care_receiver.save
      render json: caregiver
    else
      render json: new_care_receiver.errors.full_messages
    end
  end

  private
  # Params to that user input, used to create a new care receiver upon caregiver registration
  def care_receiver_params
    params.permit(:name, :age, :allergies, :precautions, :bio)
  end
end