import React from 'react';

interface Props {
  id: number
  message: string
  date: Date
}

interface State{
  message: string
  date: Date
}

class ReminderShow extends React.Component <Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      message: props.message,
      date: new Date(props.date.toDateString())
    }
  }
  
  render(){
    return(
      <div className="Reminder">
        {this.state.message}
      </div>
    )
  }

}

export default ReminderShow;
