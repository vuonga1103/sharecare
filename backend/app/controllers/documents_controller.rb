class DocumentsController < ApplicationController

    def destroy
        document = Document.find_by(id: params[:id])
        document.destroy
        render json: document
    end
end
