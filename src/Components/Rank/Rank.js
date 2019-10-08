import React, { useState, useEffect } from "react";

const Rank = ({ name, entries }) => {
  const generateEmoji = () => {
    fetch(
      `https://aph0hdwh0h.execute-api.us-east-1.amazonaws.com/dev/rank?rank=${entries}`
    )
      .then(response => response.json())
      .then(data => setEmoji(data.input))
      .catch(e => console.log("can't get rank", e));
  };
  const [emoji, setEmoji] = useState(generateEmoji());
  useEffect(() => {
    generateEmoji();
  }, [entries]); // Only re-run the effect if entries changes
  return (
    <div>
      <div className="white f3">
        {`${name}, your current entry count is...`}
      </div>
      <div className="white f1">{entries}</div>
      {emoji && <div className="white f3">{`Rank Badge: ${emoji}`}</div>}
    </div>
  );
};

export default Rank;
