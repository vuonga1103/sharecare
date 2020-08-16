class CommentsController < ApplicationController
  
  # Creates a new comment, returns the comment in { content: ..., commenter_name: ... } format if successfully created; if not (i.e. user doesn't input comment content), return the error in an array
  def create
    new_comment = Comment.create(comment_params)

    comment_with_commenter = {
      content: new_comment.content,
      commenter_name: new_comment.commenter.name
    }

    if new_comment.valid?
      render json: comment_with_commenter
    else
      render json: new_comment.errors.full_messages
    end
  end

  private
  def comment_params
    params.permit(:content, :commenter_id, :post_id)
  end
end