import { useEffect, useState } from 'react';
import FlexBox from '../elements/FlexBox';

const Notes = ({ synth }) => {
  const [notes, setNotes] = useState([]);
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']; 

  useEffect(() => {
    let noteArray = [];

    for (let octave = 0; octave <= 8; octave++) {
      for (let note of noteNames) {
        noteArray.push({
          note: `${note}${octave}`,
          baseNote: `${note}`,
          octave: `${octave}`,
        });
      }
    }
    setNotes(noteArray);
  }, []);

  const testNote = (note) => {
    synth.triggerAttackRelease(note, '8n');
  };

  const handleDragStart = (e, note) => {
    e.dataTransfer.setData("note", note);
    e.dataTransfer.setData("source", "notes");
  };

  return (
    <FlexBox id="note-wrapper" dir="row" jc="space-evenly" ai="flex-start" h="98%">
      {noteNames.map((nn) => (
        <FlexBox key={nn} mx={2} my={2} w="50px" h="100%" jc="flex-start" bo="1px solid black">
          <p style={{ color: 'black' }}>{nn}</p>
          <FlexBox oy="scroll" w="90%" h="100%" jc="flex-start">
            {notes
              .filter((n) => n.baseNote === nn)
              .map((n) => (
                <FlexBox
                  key={n.note}
                  onClick={() => testNote(n.note)}
                  onDragStart={(e) => handleDragStart(e, n.note)}
                  value={n.note}
                  br={8}
                  drg={true}
                  cs="pointer"
                  jc="center"
                  bg="#242424"
                  w="95%"
                  h="40px"
                  my={10}
                >
                  <p style={{ width: '95%', textAlign: 'center', fontWeight: 'bolder', color: 'white' }}>
                    {n.note}
                  </p>
                </FlexBox>
              ))}
          </FlexBox>
        </FlexBox>
      ))}
    </FlexBox>
  );
};

export default Notes;