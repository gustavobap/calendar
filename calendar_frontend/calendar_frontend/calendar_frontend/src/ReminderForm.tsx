import React, { useState } from "react";
import { Reminder } from "./model/Reminder";
import "./ReminderForm.css";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { Grid } from "@material-ui/core";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker,
} from "@material-ui/pickers";
import ErrorIcon from "@material-ui/icons/Error";
import CircularProgress from "@material-ui/core/CircularProgress";

interface Props {
  reminder: Reminder;
  closeForm: () => void;
  delete: (success: () => void, error: () => void) => void;
  save: (reminder: Reminder) => Promise<Reminder>;
}

const ReminderForm = (props: Props) => {
  const [message, setMessage] = useState(props.reminder.message);
  const [date, setDate] = useState(props.reminder.date);
  const [color, setColor] = useState(props.reminder.color);
  const [status, setStatus] = useState("idle");

  const handleSave = (event: any) => {
    event.preventDefault();
    setStatus("loading");

    var newReminder = {
      id: props.reminder.id,
      message: message,
      date: date,
      color: color,
    };
    props
      .save(newReminder)
      .then((reminder) => {
        props.reminder.message = reminder.message;
        props.reminder.date = reminder.date;
        props.reminder.color = reminder.color;
        props.closeForm();
      })
      .catch(() => {
        setStatus("error");
      });
  };

  const handleDelete = (event: any) => {
    event.preventDefault();
    setStatus("loading");
    const success = () => {
      props.closeForm();
    };
    const error = () => {
      setStatus("error");
    };
    props.delete(success, error);
  };

  const handleDateChange = (newDate: any) => {
    var d = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      date.getHours(),
      date.getMinutes(),
      0,
      0
    );
    setDate(d);
    console.debug(`changed date ${d}`);
  };
  const handleTimeChange = (time: any) => {
    var d = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      0,
      0
    );
    setDate(d);
    console.debug(`changed time ${d}`);
  };

  const handleColorChange = (event: any) => {
    setColor(event.target.value);
    console.log(`changed color ${event.target.value}`);
  };

  const radioOption = (name: string, value: string) => {
    return <FormControlLabel value={value} control={<Radio />} label={name} />;
  };

  const isLoading = () => {
    return status === "loading";
  };
  const isError = () => {
    return status === "error";
  };

  return (
    <form className="ReminderForm" onSubmit={handleSave}>
      {isLoading() && <CircularProgress />}
      {isError() && (
        <div>
          <Typography color="error">
            <ErrorIcon style={{ fontSize: 50 }} />
            There was an error connecting to the server.
          </Typography>
        </div>
      )}
      <Grid>
        <Grid item>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              label="Date"
              format="MM/dd/yyyy"
              helperText="Select a date"
              value={date}
              disabled={isLoading()}
              onChange={handleDateChange}
            />
            <TimePicker
              label="Time"
              helperText="Select time"
              value={date}
              disabled={isLoading()}
              onChange={handleTimeChange}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item>
          <FormControl component="fieldset" disabled={isLoading()}>
            <FormLabel component="legend">Color</FormLabel>
            <RadioGroup
              row
              aria-label="Color"
              name="color"
              value={color}
              onChange={handleColorChange}
            >
              {radioOption("White", "white")}
              {radioOption("Red", "red")}
              {radioOption("Green", "green")}
              {radioOption("Blue", "blue")}
              {radioOption("Yellow", "yellow")}
              {radioOption("Pink", "pink")}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField
            label="Message"
            name="message"
            multiline
            rows={6}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            variant="filled"
            style={{ width: 500, backgroundColor: color }}
            required
            disabled={isLoading()}
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        <Grid item>
          <ButtonGroup
            className="ReminderForm-button-group"
            disabled={isLoading()}
          >
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="secondary"
            >
              Delete
            </Button>
            <Button onClick={props.closeForm} variant="contained">
              Close
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </form>
  );
};

export default ReminderForm;
