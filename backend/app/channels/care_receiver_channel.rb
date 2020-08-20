class CareReceiverChannel < ApplicationCable::Channel
  def subscribed
    care_receiver = CareReceiver.find(params[:id])
    stream_for care_receiver
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
