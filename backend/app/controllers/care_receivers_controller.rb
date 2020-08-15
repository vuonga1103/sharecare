class CareReceiversController < ApplicationController

  # Creates a new care receiver from info user entered on registration; link the care receiver to the caregiver who registered, and return back the caregiver
  def create
    new_care_receiver = CareReceiver.create(care_receiver_params)
    caregiver = Caregiver.find(params[:caregiver_id])
    new_care_receiver.caregivers << caregiver
    new_care_receiver.save

    render json: caregiver
  end

  private
  # Params to that user input, used to create a new care receiver upon caregiver registration
  def care_receiver_params
    params.permit(:name, :age, :allergies, :precautions, :bio)
  end
end