class PostsController < ApplicationController
  
  # Create a new instance of the post, send back the post object if valid, otherwise send back error array
  def create
    new_post = Post.create(post_params)
    post_with_author = { post: new_post, author: new_post.author }

    if new_post.valid?
      render json: post_with_author
    else
      render json: new_post.errors.full_messages
    end
  end

  def acknowledgers
    post = Post.find_by(id: params[:id])

    acknowledgers = post.acknowledgments.map { |acknowledgment| acknowledgment.caregiver.name }
    
    render json: acknowledgers
  end

  private
  def post_params
    params.permit(:title, :content, :priority, :author_id)
  end
end