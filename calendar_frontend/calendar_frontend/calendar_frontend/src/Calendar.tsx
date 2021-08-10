import React from "react";
import "./Calendar.css";
import Day from "./Day";
import RemindersList from "./RemindersList";

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

import { Reminder } from "./model/Reminder";
import api from "./api";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

import ErrorIcon from "@material-ui/icons/Error";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Grid, Typography } from "@material-ui/core";

interface Props {}

interface State {
  year: number;
  month: number;
  reminders: Array<Reminder>;
  showRemindersList: boolean;
  selectedDayNumber: number;
  status: string;
}

const WEEK_DAYS_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

class Calendar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    var date = new Date();
    this.state = {
      year: date.getFullYear(),
      month: date.getMonth(),
      reminders: [],
      showRemindersList: false,
      selectedDayNumber: 0,
      status: "loading",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDeleteReminder = this.handleDeleteReminder.bind(this);
    this.handleCreateReminder = this.handleCreateReminder.bind(this);
    this.handleUpdateReminder = this.handleUpdateReminder.bind(this);
  }

  componentDidMount() {
    this.fetchReminders();
  }

  private async fetchReminders() {
    this.setState({
      status: "loading",
    });

    api
      .get("reminders", { params: { month_date: this.dayDate(1) } })
      .then((res) => {
        this.setState({
          reminders: res.data.map((item: any) => {
            return {
              id: item.id,
              date: new Date(item.date),
              message: item.message,
              color: item.color,
            };
          }),
          status: "idle",
        });
      })
      .catch(() => {
        this.setState({ status: "error" });
      });
  }

  private handleChange(date: MaterialUiPickersDate) {
    if (date !== null) {
      this.setDate(date.getFullYear(), date.getMonth());
    }
  }

  private setDate(year: number, month: number) {
    this.setState(
      {
        year: year,
        month: month,
      },
      this.fetchReminders
    );
  }

  private dayDate(dayNumber: number) {
    return new Date(this.state.year, this.state.month, dayNumber, 0, 0, 0, 0);
  }

  private getReminders(dayNumber: number) {
    if (dayNumber <= 0) {
      return [];
    }
    const ini = this.dayDate(dayNumber);
    const end = new Date(ini.getTime());
    end.setDate(end.getDate() + 1);

    const a = this.state.reminders.filter(
      (reminder) =>
        reminder.date.getTime() >= ini.getTime() &&
        reminder.date.getTime() < end.getTime()
    );

    return a;
  }

  private isLoading() {
    return this.state.status === "loading";
  }
  private isError() {
    return this.state.status === "error";
  }

  private renderCalendar() {
    var selectedDate = new Date(this.state.year, this.state.month, 1);
    var date = new Date(selectedDate);
    var dayList = new Array(6 * 7).fill(null);
    // starts with day of week (0 for sunday)
    var dayIndex = date.getDay();

    while (date.getMonth() === this.state.month) {
      dayList[dayIndex] = this.renderDay(date.getDate(), dayIndex);
      date.setDate(date.getDate() + 1);
      dayIndex++;
    }

    console.debug(dayList);

    return (
      <div className="Calendar">
        <div className="CalendarHeader">
          <Grid>
            <Grid item style={{ display: "flex", gap: "1rem" }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  variant="inline"
                  openTo="month"
                  views={["year", "month"]}
                  label="Month"
                  format="MMMM yyyy"
                  helperText="Select a year and month"
                  value={selectedDate}
                  onChange={this.handleChange}
                />
              </MuiPickersUtilsProvider>
              {this.isLoading() && (
                <div>
                  <CircularProgress color="secondary" />
                </div>
              )}
              {this.isError() && (
                <div>
                  <Typography color="error">
                    <ErrorIcon style={{ fontSize: 50 }} />
                    There was an error connecting to the server.
                  </Typography>
                </div>
              )}
            </Grid>
          </Grid>
        </div>

        <div className="Calendar-grid">
          {WEEK_DAYS_NAMES.map((weekDay) => (
            <div className="Calendar-week-header">{weekDay}</div>
          ))}
          {dayList.map((day, inx) =>
            day === null ? this.renderDay(0, inx) : day
          )}
        </div>
      </div>
    );
  }

  private renderDay(number: number, index: number) {
    console.debug("Building " + number + " -> " + index);
    return (
      <Day
        number={number}
        firstDayOfWeek={index % 7 === 0}
        key={index}
        reminders={this.getReminders(number)}
        onclick={() =>
          this.setState({ showRemindersList: true, selectedDayNumber: number })
        }
      />
    );
  }

  private renderRemindersList() {
    var dayNumber = this.state.selectedDayNumber;
    return (
      <RemindersList
        day={this.dayDate(dayNumber)}
        reminders={this.getReminders(dayNumber)}
        deleteReminder={this.handleDeleteReminder}
        updateReminder={this.handleUpdateReminder}
        createReminder={this.handleCreateReminder}
        onClickClose={() => this.setState({ showRemindersList: false })}
      />
    );
  }

  private handleDeleteReminder(
    reminder: Reminder,
    success: () => void,
    fail: () => void
  ): void {
    console.debug("Delete " + reminder);
    api
      .delete(`reminders/${reminder.id}`)
      .then((res) => {
        success();
        this.setState({
          reminders: this.state.reminders.filter((r) => r.id !== reminder.id),
        });
      })
      .catch((error) => fail());
  }

  private handleCreateReminder(reminder: Reminder): Promise<Reminder> {
    console.debug("Create");
    console.debug(reminder);

    return new Promise((resolve, reject) => {
      api
        .post(`reminders`, { reminder })
        .then((res) => {
          reminder.id = res.data.id;
          this.setState({
            reminders: [...this.state.reminders, reminder].sort((a, b) =>
              a.date > b.date ? 1 : -1
            ),
          });
          resolve(reminder);
        })
        .catch((error) => reject(error));
    });
  }

  private handleUpdateReminder(reminder: Reminder): Promise<Reminder> {
    console.debug("Update " + reminder);

    return new Promise((resolve, reject) => {
      api
        .patch(`reminders/${reminder.id}`, { reminder })
        .then((res) => {
          console.log("Reminder updated");
          resolve(reminder);
        })
        .catch((error) => reject(error));
    });
  }

  render() {
    return (
      <div className="Calendar">
        {this.state.showRemindersList
          ? this.renderRemindersList()
          : this.renderCalendar()}
      </div>
    );
  }
}

export default Calendar;
