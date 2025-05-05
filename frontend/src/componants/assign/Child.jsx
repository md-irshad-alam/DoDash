import React, { useState } from "react";

const Child = ({ setinputData }) => {
  const [inputData, setInputData] = useState("");
  const handleChange = (ev) => {
    setInputData(ev.target.value);
  };
  const handleAdd = () => {
    setinputData((prev) => [...prev, inputData]);
  };
  return (
    <div>
      <input type="text" className=" border-1" onChange={handleChange} />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default Child;
