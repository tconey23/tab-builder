import { useEffect, useState } from 'react';
import FlexBox from '../elements/FlexBox';
import "@flaticon/flaticon-uicons/css/all/all.css"
import { motion, AnimatePresence } from 'framer-motion';

const MotionFlex = motion(FlexBox)

const NoteTrash = ({toggleTrash}) => {
  const [trashBucket, setTrashBucket] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const note = e.dataTransfer.getData("note");
    const source = e.dataTransfer.getData("source");
    const index = e.dataTransfer.getData("index");

    if (source === "timeline") {
      // Notify TabBuilder to remove note
      const removeEvent = new CustomEvent("remove-timeline-note", {
        detail: { index },
      });
      window.dispatchEvent(removeEvent);
    }

    setTrashBucket((prev) => [...prev, { note }]);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const removeNote = (index) => {
    const newTrash = trashBucket.filter((_, i) => i !== index);
  setTrashBucket(newTrash);
  }

  console.log(toggleTrash)

  return (
    <AnimatePresence> 
    <MotionFlex
      w="100%"
      h="100px"
      bg="#eee"
      jc="flex-start"
      dir="row"
      onDrop={handleDrop}
      onDragOver={allowDrop}
      id='note-trash'
      initial={{height: '0px'}}
      animate={{height: toggleTrash ? '100px' : '0px'}}
      transition={{duration: 2}}
      >
      {trashBucket.map((event, index) => (
          <FlexBox
          key={index}
          drg={false}
          w="100%"
          h="100%"
          mx={1}
          bg="tomato"
          jc="center"
          ai="center"
          id='note-trash2'
          >
            <FlexBox bg='' value={index}>
                <button onClick={() => removeNote(index)}>
                    <i style={{fontSize: '20px', width: '50px', height: '50px', color: 'whitesmoke'}} className="fi fi-sr-cross-circle"></i>
                </button>
                <p style={{color: 'black'}}>
                    {event.note}
                </p>
            </FlexBox>
        </FlexBox>
      ))}
    </MotionFlex>
    </AnimatePresence>
  );
};

export default NoteTrash;