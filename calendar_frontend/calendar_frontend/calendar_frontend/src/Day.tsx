import React from "react";
import "./Day.css";
import { Reminder } from "./model/Reminder";
import MailIcon from "@material-ui/icons/Mail";
import { Button, Badge, Card } from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

interface Props {
  number: number;
  firstDayOfWeek: boolean;
  reminders: Array<Reminder>;
  onclick: () => void;
}

class Day extends React.Component<Props> {
  render() {
    if (this.props.number <= 0) {
      return (
        <Card
          className={this.props.firstDayOfWeek ? "Day-first-of-week" : "Day"}
          variant="outlined"
        />
      );
    }

    return (
      <Card
        className={this.props.firstDayOfWeek ? "Day-first-of-week" : "Day"}
        variant="outlined"
      >
        <CardHeader title={this.props.number}></CardHeader>
        <CardContent></CardContent>
        <CardActions>
          <Badge
            color="secondary"
            badgeContent={this.props.reminders.length}
            className="Day-reminder-count"
          >
            <Button
              color="primary"
              aria-label="reminders"
              endIcon={<MailIcon />}
              onClick={this.props.onclick}
            >
              Add Note
            </Button>
          </Badge>
        </CardActions>
      </Card>
    );
  }
}

export default Day;
