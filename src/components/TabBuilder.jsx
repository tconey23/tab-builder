import { useEffect, useState } from 'react';
import FlexBox from '../elements/FlexBox';

const TabBuilder = ({ synth }) => {
  const [timeline, setTimeline] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const note = e.dataTransfer.getData("note");
    const source = e.dataTransfer.getData("source");

    if (source === "notes") {
      setTimeline((prev) => [...prev, { note }]);
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleTimelineDragStart = (e, index) => {
    e.dataTransfer.setData("note", timeline[index].note);
    e.dataTransfer.setData("source", "timeline");
    e.dataTransfer.setData("index", index);
  };

  useEffect(() => {
    const handleRemove = (e) => {
      const index = parseInt(e.detail.index);
      setTimeline((prev) => prev.filter((_, i) => i !== index));
    };

    window.addEventListener("remove-timeline-note", handleRemove);
    return () => window.removeEventListener("remove-timeline-note", handleRemove);
  }, []);

  return (
    <FlexBox w="100%" h="200px" bg="#eee" jc="flex-start" dir="row" onDrop={handleDrop} onDragOver={allowDrop}>
      {timeline.map((event, index) => (
        <FlexBox
          key={index}
          drg={true}
          onDragStart={(e) => handleTimelineDragStart(e, index)} 
          w="60px"
          h="100%"
          mx={1}
          bg="tomato"
          jc="center"
          ai="center"
        >
          <select></select>
          <p>{event.note}</p>

        </FlexBox>
      ))}
    </FlexBox>
  );
};

export default TabBuilder;