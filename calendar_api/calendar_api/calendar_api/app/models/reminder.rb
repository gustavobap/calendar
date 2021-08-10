class Reminder < ApplicationRecord

	validates :message, length: { maximum: 30 }
	validates :message, :color, :date, presence: true

end