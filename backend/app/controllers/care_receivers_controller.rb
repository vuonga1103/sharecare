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

  # Find the care receiver by id, sends back posts associated with that care receiver, including author's info; if the care receiver doesn't have any posts associated, send back message indicating so
  def posts
    care_receiver_found = CareReceiver.find_by(id: params[:id])
    posts_with_author = care_receiver_found.posts.map do |post| 
      {post: post, author: post.author, acknowledgments: post.acknowledgments}
    end

    if care_receiver_found.posts.size > 0 
      render json: posts_with_author
    else
      render json: { message: "No posts yet" }
    end
  end

  #return important posts made by the caregivers associated with the caregivers
  def important_posts
    care_receiver_found = CareReceiver.find_by(id: params[:id])
    important_posts_with_author = care_receiver_found.posts.where(priority: 'high').map do |post| 
       {post: post, author: post.author}
    end
    render json: important_posts_with_author

  end

  private
  # Params to that user input, used to create a new care receiver upon caregiver registration
  def care_receiver_params
    params.permit(:name, :age, :allergies, :precautions, :bio)
  end
end