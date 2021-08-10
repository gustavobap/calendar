class CreateReminders < ActiveRecord::Migration[6.1]
  def change
    create_table :reminders do |t|
      t.text :message
      t.datetime :date, :index => true
      t.string :color
      t.timestamps
    end
  end
end
