class MessagesController < ApplicationController
  def create
    message = Message.new(message_params)
    
    if message.save
      chat_room = CareReceiver.find_by(id: message.care_receiver.id)
      
      CareReceiverChannel.broadcast_to(chat_room, message)
      
      render json: message
    else
      render json: {errors: message.errors.full_messages}
    end
  end

  private
  def message_params
    params.require(:message).permit(:content, :care_receiver_id, :caregiver_id)
  end
end