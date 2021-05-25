import "./DatePicker.css";
import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  dateArr: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

function DatePicker({ dateArr, onChange }) {
  return (
    <select
      className="date-picker"
      defaultValue={dateArr[0]}
      onChange={(e) => onChange(e.target.value)}
    >
      {dateArr.map((date, i) => (
        <option key={i} value={date}>
          {date}
        </option>
      ))}
    </select>
  );
}

DatePicker.propTypes = propTypes;

export default DatePicker;
