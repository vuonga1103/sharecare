class AcknowledgmentsController < ApplicationController
  def create
    new_acknowledgment = Acknowledgment.create_or_find_by(acknowledgment_params)

    render json: new_acknowledgment
  end

  def destroy
    acknowledgment_found = Acknowledgment.find_by(caregiver_id: params[:caregiver_id], post_id: params[:post_id])
    acknowledgment_found.destroy
    render json: acknowledgment_found
  end

  private
  # Params to that user input, used to create a new care receiver upon caregiver registration
  def acknowledgment_params
    params.permit(:caregiver_id, :post_id)
  end
end