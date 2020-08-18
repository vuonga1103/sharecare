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

  # Update instance of post, send back the post object if valid, otherwise send back error array
  def show
    post = Post.find_by(id: params[:id])

    render json: post
  end
  
  def edit
    post = Post.find_by(id: params[:id])
    
    if post.update(post_params)
      render json: post
    else
      render json: ["Error: Unable to submit post. Please make sure no fields are empty and try again."]
    end
  end

  def priority_update
    post = Post.find_by(id: params[:id])
    post.update(priority: params[:priority])
    render json: post
    
  end

  # Destroy a post
  def destroy
    post = Post.find_by(id: params[:id])
    post.destroy
    render json: post
  end

  # Send back a list of acknowledgeres in an array
  def acknowledgers
    post = Post.find_by(id: params[:id])

    acknowledgers = post.acknowledgments.map { |acknowledgment| acknowledgment.caregiver.name }
    
    render json: acknowledgers
  end

  # Send back the comment object with the commenter_name attached
  def comments
    post = Post.find_by(id: params[:id])
    comments = post.comments.reverse

    if comments.size > 0
      comments_with_commenter = comments.map do |comment| 
        {id: comment.id, content: comment.content, commenter_id: comment.commenter_id, post_id: comment.post_id, commenter_name: comment.commenter.name }
      end

      render json: comments_with_commenter
    else
      render json: ["No comments for this post yet!"]
    end
  end

  private
  def post_params
    params.permit(:title, :content, :priority, :author_id)
  end
end