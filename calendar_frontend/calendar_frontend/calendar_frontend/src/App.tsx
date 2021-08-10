import React from "react";
import Calendar from "./Calendar";

class App extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Calendar />
      </div>
    );
  }
}

export default App;
