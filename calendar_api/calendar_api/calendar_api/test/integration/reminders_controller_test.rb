require "test_helper"

class RemindersControllerTest < ActionDispatch::IntegrationTest

  teardown do
    Rails.cache.clear
  end

  test "create a new reminder" do
    params = {:reminder => {:message => "message", :color => "white", :date => DateTime.now}}
    post reminders_url, params: params
    assert_response(:success)
  end

  test "delete a reminder" do
    reminder = reminders(:first_in_july_21)
    assert_equal 10, Reminder.count
    delete reminder_url(reminder)
    assert_response(:success)
    assert_equal 9, Reminder.count
  end

  test "update a reminder" do
    reminder = reminders(:first_in_july_21)
    date = DateTime.new(2012, 1, 1, 1, 1, 1)
    params = {:reminder => {:message => "message changed", :color => "blue", :date => date}}
    put reminder_url(reminder), params: params
    assert_response(:success)
    res = JSON.parse(@response.body)
    assert_equal(reminder.id, res["id"])
    assert_equal("message changed", res["message"])
    assert_equal("blue", res["color"])
    assert_equal(date.strftime('%FT%T.%LZ'), res["date"])
  end
  
  test "list reminders without parameters and with Reminders in current month" do
    travel_to(Date.new(2021, 7, 1))
    get reminders_url
    assert_response :success
    assert_equal "application/json", @response.media_type
    res = JSON.parse(@response.body)
    assert_equal 2, res.size
    puts(res)
    assert_equal "first_in_july_21", res[0]["message"]
    assert_equal "last_in_july_21", res[1]["message"]
  end

  test "list reminders without parameters and without Reminders in current month" do
    travel_to(Date.new(2021, 5, 1))
    get reminders_url
    assert_response :success
    assert_equal "application/json", @response.media_type
    assert_equal 0, JSON.parse(@response.body).size
  end

  test "list reminders with parameters and with Reminders in selected month" do
    travel_to(Date.new(2021, 5, 1))
    get reminders_url, params: {month_date: Date.new(2021, 8, 1)}
    assert_response :success
    assert_equal "application/json", @response.media_type
    res = JSON.parse(@response.body)
    assert_equal 2, res.size
    assert_equal "first_in_august_21", res[0]["message"]
    assert_equal "last_in_august_21", res[1]["message"]
  end
  
  test "list reminders with parameters and without Reminders in selected month" do
    travel_to(Date.new(2021, 7, 1))
    get reminders_url, params: {month_date: Date.new(2021, 9, 1)}
    assert_response :success
    assert_equal "application/json", @response.media_type
    assert_equal 0, JSON.parse(@response.body).size
  end

  test "list reminders with timezone offest plus 2 hours" do
    travel_to(Date.new(2021, 7, 1))
    get reminders_url, params: {month_date: DateTime.new(2021, 11, 30, 22, 0, 0)}
    assert_response :success
    assert_equal "application/json", @response.media_type
    res = JSON.parse(@response.body)
    assert_equal 2, res.size
    assert_equal "first_in_december_21_tz_plus_2", res[0]["message"]
    assert_equal "last_in_december_21_tz_plus_2", res[1]["message"]
  end

  test "list reminders with timezone offest minus 2 hours" do
    travel_to(Date.new(2021, 7, 1))
    get reminders_url, params: {month_date: DateTime.new(2022, 12, 1, 2, 0, 0)}
    assert_response :success
    assert_equal "application/json", @response.media_type
    res = JSON.parse(@response.body)
    assert_equal 2, res.size
    assert_equal "first_in_december_22_tz_minus_2", res[0]["message"]
    assert_equal "last_in_december_22_tz_minus_2", res[1]["message"]
  end

end