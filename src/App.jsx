import React from "react";
import "./App.css";
import Card from "./components/card";

function App() {
  const t = new Date();
  const time = t.toLocaleTimeString();
  const day = t.toLocaleString("en-us", { weekday: "long" });
  const date = t.getDate();
  const monthName = t.toLocaleString("default", { month: "long" });
  const year = t.getFullYear();
  return (
    <div>
      <Card time={time} day={day} date={date} month={monthName} year={year} />
    </div>
  );
}
export default App;
