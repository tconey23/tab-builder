import { useEffect, useState, useRef } from 'react';
import FlexBox from '../elements/FlexBox';

const Notes = ({ synth }) => {
  const [notes, setNotes] = useState([]);
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const [library, setLibrary] = useState('/guitar-acoustic/')
  const [syncScroll, setSyncScroll] = useState(false)
  const [scrollLevel, setScrollLevel] = useState()

  const scrollRef = useRef();

  const libs = [
    {type: 'Acoustic Guitar', path: '/guitar-acoustic/'},
    {type: 'Piano', path: '/piano/'}
  ]

useEffect(() => {
  const scrollFunc = (e) => {
    if (e.target instanceof HTMLElement && e.target.scrollTop !== undefined) {
      setScrollLevel(e.target.scrollTop); // or scrollHeight if you want total height
    }
  };

  if (syncScroll) {
    document.addEventListener('scroll', scrollFunc, true);
  }

  return () => {
    document.removeEventListener('scroll', scrollFunc, true);
  };
}, [syncScroll]);

useEffect(() =>{
  if(syncScroll){
    let n = document.getElementsByClassName('noteList')
    Array.from(n).forEach(el => {
      el.scrollTop = scrollLevel;
    });
    // n?.[0].scrollHeight = scrollLevel
  }  
}, [scrollLevel])

  const buildNoteObj = async () => {
    let noteArray = [];
        for (let octave = 0; octave <= 8; octave++) {
          for (let note of noteNames) {

            let canPlay = false

            try {
              let path = `${library}${note.replace('#', 's')}${octave}.mp3`
              const res = await fetch(path)
              const contentType = res.headers.get("content-type");
              
              if(res.ok && contentType === 'audio/mpeg'){
                canPlay = true
              } else {
                // console.log(note, octave)
              }
            } catch (error) {
                console.error(error);
                
            }
            noteArray.push({
              note: `${note}${octave}`,
              baseNote: `${note}`,
              octave: `${octave}`,
              url: `${library}${note.replace('#', 's')}${octave}.mp3`,
              canPlay: canPlay
            });
          }
        }
        setNotes(noteArray);
  }

  useEffect(() => {
    setNotes([])
    buildNoteObj()
  }, [library]);

const testNote = (note) => {
  const audio = new Audio(`${library}${note.replace('#', 's')}.mp3`);
  audio.play();
};

  const handleDragStart = (e, note) => {
  const draggedNote = notes.find(n => n.note === note);
  if (!draggedNote) return;

  e.dataTransfer.setData("noteData", JSON.stringify(draggedNote));
  e.dataTransfer.setData("type", "note");
  e.dataTransfer.setData("source", "notes");
};

  return (
    <FlexBox id="note-wrapper" dir="row" jc="center" ai="flex-start" h="98%" w='100%' ref={scrollRef}>
      <FlexBox>
        <select value={library} onChange={(e) => setLibrary(e.target.value)}>
          <option value={null}>None</option>
          {libs.map((l, i) =>
            <option key={i} value={l.path}>{l.type}</option>
          )}
        </select>
      </FlexBox>
      <FlexBox oy="scroll" w="10%" h="100%" jc="flex-start">
        <p style={{ color: 'black' }}>Rest</p>
        <FlexBox
          br={8}
          drg={true}
          cs="pointer"
          jc="center"
          bg="#242424"
          w="95%"
          h="40px"
          my={10}
          value={'rest1n'}
          onDragStart={(e) => {
            handleDragStart(e, 'rest-1n')
            e.dataTransfer.setData("type", "rest");
            e.dataTransfer.setData("length", "1n");
          }}
        >
          <p>Rest (1n)</p>
        </FlexBox>

        <FlexBox
          br={8}
          drg={true}
          cs="pointer"
          jc="center"
          bg="#242424"
          w="95%"
          h="40px"
          my={10}
          value={'rest4n'}
          onDragStart={(e) => {
            handleDragStart(e, 'rest-2n')
            e.dataTransfer.setData("type", "rest");
            e.dataTransfer.setData("length", "2n");
          }}
        >
          <p>Rest (2n)</p>
        </FlexBox>
        <FlexBox
          br={8}
          drg={true}
          cs="pointer"
          jc="center"
          bg="#242424"
          w="95%"
          h="40px"
          my={10}
          value={'rest4n'}
          onDragStart={(e) => {
            handleDragStart(e, 'rest-4n')
            e.dataTransfer.setData("type", "rest");
            e.dataTransfer.setData("length", "4n");
          }}
        >
          <p>Rest (4n)</p>
        </FlexBox>
        <FlexBox
          br={8}
          drg={true}
          cs="pointer"
          jc="center"
          bg="#242424"
          w="95%"
          h="40px"
          my={10}
          value={'rest4n'}
          onDragStart={(e) => {
            handleDragStart(e, 'rest-8n')
            e.dataTransfer.setData("type", "rest");
            e.dataTransfer.setData("length", "8n");
          }}
        >
          <p>Rest (8n)</p>
        </FlexBox>
        <FlexBox
          br={8}
          drg={true}
          cs="pointer"
          jc="center"
          bg="#242424"
          w="95%"
          h="40px"
          my={10}
          value={'rest4n'}
          onDragStart={(e) => {
            handleDragStart(e, 'rest-16n')
            e.dataTransfer.setData("type", "rest");
            e.dataTransfer.setData("length", "16n");
          }}
        >
          <p>Rest (16n)</p>
        </FlexBox>
        <FlexBox
          br={8}
          drg={true}
          cs="pointer"
          jc="center"
          bg="#242424"
          w="95%"
          h="40px"
          my={10}
          value={'rest4n'}
          onDragStart={(e) => {
            handleDragStart(e, 'rest-32n')
            e.dataTransfer.setData("type", "rest");
            e.dataTransfer.setData("length", "32n");
          }}
        >
          <p>Rest (32n)</p>
        </FlexBox>
        
      </FlexBox>
      {noteNames.map((nn) => (
        <FlexBox key={nn} mx={2} my={2} w="6%" h="100%" jc="flex-start" bo="1px solid black">
          <p style={{ color: 'black' }}>{nn}</p>
          <FlexBox oy="scroll" w="90%" h="100%" jc="flex-start" cl='noteList'>
            {notes
              .filter((n) => n.baseNote === nn)
              .map((n) => (
                <FlexBox
                  cl='noteButton'
                  key={n.note}
                  onClick={() => {
                    if(n?.canPlay){
                      testNote(n.note)
                    }
                  }}
                  onDragStart={(e) => handleDragStart(e, n.note)}
                  value={n.note}
                  br={8}
                  drg={true}
                  cs="pointer"
                  jc="center"
                  bg={n.canPlay ? "#242424" : ''}
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
      <FlexBox>
        <input checked={syncScroll} onChange={() => setSyncScroll(prev => !prev)} type='checkbox' />
        <label style={{color:'black'}}>Sync Scroll</label>
      </FlexBox>
    </FlexBox>
  );
};

export default Notes;