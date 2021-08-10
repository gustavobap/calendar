class RemindersController < ApplicationController
	
	def index
		if(params[:month_date].nil?)
			date = Date.today.to_datetime
		else
			date = params[:month_date].to_datetime
		end

		ini, fin = day_range(date.to_datetime)

		render :json => Reminder.where(:date => ini...fin)
	end
	
	def create
		reminder = Reminder.new(reminder_params)

		if reminder.save
			render :json => reminder, :status => :created, :location => reminder, 
				:methods => [:id, :message, :date, :color]
		else
			render :json => reminder.errors, :status => :unprocessable_entity
		end
	end
	
	def update
		reminder = Reminder.find(params[:id])
		if reminder.update(reminder_params([:id]))
			render :json => reminder
		else
			render :json => reminder.errors, :status => :unprocessable_entity
		end
	end

	def destroy
		Reminder.find(params[:id]).destroy
	end
	
	private
	
		def reminder_params(extra=[])
			params.require(:reminder).permit([:message, :date, :color] + extra)
		end

		def day_range(datetime)
			# get month in original timezone
			month = (datetime + 1.day).month
			first_date = DateTime.new(datetime.year, month, 1)
			offset = first_date - datetime
			last_date = DateTime.new(datetime.year, month, -1) + 1.day
			return [datetime, last_date - offset]
		end
	
end

