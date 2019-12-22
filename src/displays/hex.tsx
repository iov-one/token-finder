import { Encoding } from "@iov/encoding";
import React from "react";

import { priorities, StaticDisplay } from ".";

export function makeHexDisplay(input: string): StaticDisplay {
  const inputData = Encoding.fromHex(input);
  return {
    id: `${input}#hex-summary`,
    interpretedAs: "Hex data summary",
    priority: priorities.hex,
    data: (
      <div>
        Length: {inputData.length} bytes
        <br />
        <div className="pair">
          <div className="pair-key">Lower:&nbsp;</div>
          <div className="pair-value data">{input.toLowerCase()}</div>
        </div>
        <div className="pair">
          <div className="pair-key">Upper:&nbsp;</div>
          <div className="pair-value data">{input.toUpperCase()}</div>
        </div>
      </div>
    ),
  };
}
