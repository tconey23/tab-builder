import React from 'react';
import FlexBox from '../elements/FlexBox';

const FretBoard = ({ frets = 5, width = 600, height = 200 }) => {
  const stringNames = ['E', 'A', 'D', 'G', 'B', 'E'];
  const stringCount = stringNames.length;
  const stringSpacing = height / (stringCount + 1);
  const fretSpacing = width / frets;

  return (
    <FlexBox my='10px' h='100%' jc='center'>
      <svg width={width} height={height}>
        {/* Nut */}
        <rect x="0" y="0" width="10" height={height} fill="black" />

        {/* Frets */}
        {[...Array(frets)].map((_, i) => {
          const x = fretSpacing * (i + 1);
          return (
            <line
            key={`fret-${i}`}
            x1={x}
            y1={0}
            x2={x}
            y2={height}
            stroke="gray"
            strokeWidth={2}
            />
          );
        })}

        {/* Strings */}
        {stringNames.map((name, i) => {
          const y = stringSpacing * (i + 1);
          return (
            <g key={`string-${i}`}>
              {/* String line */}
              <line
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                stroke="black"
                strokeWidth={1}
                />
              {/* Label */}
              <text x={-20} y={y + 4} fontSize="12" fill="black">
                {name}
              </text>
            </g>
          );
        })}
      </svg>
    </FlexBox>
  );
};

export default FretBoard;
