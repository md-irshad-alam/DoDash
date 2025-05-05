import React, { useState } from "react";
import Child from "./Child";

const Parent = () => {
  let [fruits, setFruits] = useState(["apple", "banana"]);

  return (
    <>
      <div className="flex flex-col min-h-screen items-center place-content-center">
        <div>
          <Child setinputData={setFruits} />
        </div>
        <div className="block">
          <ul>
            {fruits?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Parent;
