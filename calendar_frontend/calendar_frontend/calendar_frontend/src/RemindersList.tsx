import React from "react";
import { Reminder } from "./model/Reminder";
import ReminderForm from "./ReminderForm";
import "./RemindersList.css";
import EditIcon from "@material-ui/icons/Edit";
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@material-ui/core";

interface Props {
  day: Date;
  reminders: Array<Reminder>;
  onClickClose: () => void;
  deleteReminder: (
    reminder: Reminder,
    success: () => void,
    error: () => void
  ) => void;
  createReminder: (reminder: Reminder) => Promise<Reminder>;
  updateReminder: (reminder: Reminder) => Promise<Reminder>;
}

interface State {
  selectedId: number;
  showEditForm: boolean;
  showNewForm: boolean;
}

class RemindersList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedId: -1,
      showEditForm: false,
      showNewForm: false,
    };
  }

  render() {
    if (this.state.showNewForm) {
      return this.renderNewForm();
    } else if (this.state.showEditForm) {
      return this.renderEditForm();
    } else {
      return this.renderRemindersList();
    }
  }

  private renderNewForm() {
    let reminder = {
      id: -1,
      message: "",
      date: this.props.day,
      color: "white",
    };

    return (
      <ReminderForm
        reminder={reminder}
        delete={(success, error) => {
          success();
        }}
        save={(reminder) => this.props.createReminder(reminder)}
        closeForm={() => this.setState({ showNewForm: false })}
      />
    );
  }

  private renderEditForm() {
    let reminder: Reminder = this.props.reminders.find(
      (reminder) => reminder.id === this.state.selectedId
    )!;

    return (
      <ReminderForm
        reminder={reminder}
        delete={(success, error) =>
          this.props.deleteReminder(reminder, success, error)
        }
        save={(reminder) => this.props.updateReminder(reminder)}
        closeForm={() => this.setState({ showEditForm: false })}
      />
    );
  }

  private timeString(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  private renderRemindersList() {
    return (
      <div className="reminder-list">
        <ButtonGroup className="reminder-list-button-group">
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ showNewForm: true, selectedId: -1 })}
          >
            New
          </Button>
          <Button variant="contained" onClick={this.props.onClickClose}>
            Close
          </Button>
        </ButtonGroup>
        <div className="reminder-list-header">
          {this.props.day.toDateString()}
        </div>
        {this.props.reminders.length === 0 && (
          <Card className="reminder-list-message-card">
            <CardContent className="reminder-list-message-card-content">
              No notes for today =)
            </CardContent>
          </Card>
        )}

        {this.props.reminders.map((reminder) => (
          <Grid
            container
            className="reminder-list-message-container"
            direction={"column"}
            spacing={1}
          >
            <Grid item>
              <Card className="reminder-list-message-card">
                <CardHeader
                  title={this.timeString(reminder.date)}
                  titleTypographyProps={{ variant: "caption" }}
                  style={{ backgroundColor: reminder.color }}
                ></CardHeader>
                <CardContent
                  className="reminder-list-message-card-content"
                  style={{ backgroundColor: reminder.color }}
                >
                  <Typography variant="body1">{reminder.message}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    color="primary"
                    aria-label="reminders"
                    startIcon={<EditIcon />}
                    onClick={() =>
                      this.setState({
                        showEditForm: true,
                        selectedId: reminder.id,
                      })
                    }
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        ))}
      </div>
    );
  }
}

export default RemindersList;
