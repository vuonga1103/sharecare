class CareReceiversController < ApplicationController

  # Creates a new care receiver from info user entered on registration; if valid link the care receiver to the caregiver who registered, and return back the caregiver; otherwise return error
  def create
    new_care_receiver = CareReceiver.create(care_receiver_params)
    if new_care_receiver.valid? 
      caregiver = Caregiver.find(params[:caregiver_id])
      new_care_receiver.caregivers << caregiver
      new_care_receiver.save
      
      caregiver_with_photo = {
        care_receiver_id: new_care_receiver.id,
        email: caregiver.email,
        id: caregiver.id,
        level: caregiver.level,
        name: caregiver.name,
        role: caregiver.role,
        username: caregiver.username, 
        photo_url: false
      }

      if caregiver.photo.attached?
        ccaregiver_with_photo[:photo_url] = url_for(caregiver.photo)
      end

      render json: caregiver_with_photo
      
    else
      render json: new_care_receiver.errors.full_messages
    end
  end


  def show
    care_receiver_found = CareReceiver.find_by(id: params[:id])
    render json: care_receiver_found;
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

  def my_caregivers
    care_receiver_found = CareReceiver.find_by(id: params[:id])

    cgs_with_photo = care_receiver_found.caregivers.map do |cg|
      cg_with_photo = {
        care_receiver_id: cg.care_receiver_id,
        email: cg.email,
        id: cg.id,
        level: cg.level,
        name: cg.name,
        role: cg.role,
        username: cg.username, 
        photo_url: false
      }

      if cg.photo.attached?
        cg_with_photo[:photo_url] = url_for(cg.photo)
      end

      cg_with_photo
    end

    render json: cgs_with_photo
  end

  #return important posts made by the caregivers associated with the caregivers
  def important_posts
    care_receiver_found = CareReceiver.find_by(id: params[:id])
    important_posts_with_author = care_receiver_found.posts.where(priority: 'high').map do |post| 
       {post: post, author: post.author}
    end.reverse

    if important_posts_with_author.size > 0
      render json: important_posts_with_author
    else
      render json: { message: "No posts yet" }
    end
  end

  private
  # Params to that user input, used to create a new care receiver upon caregiver registration
  def care_receiver_params
    params.permit(:name, :age, :allergies, :precautions, :bio)
  end
end