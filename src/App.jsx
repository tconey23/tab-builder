import { useRef, useEffect, useState } from 'react';
import TabBuilder from './components/TabBuilder';
import * as Tone from 'tone';
import Notes from './components/Notes';
import FlexBox from './elements/FlexBox';
import NoteTrash from './components/NoteTrash';

function App() {
  const synthRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [start, setStart] = useState(0)
  const [toggleTrash, setToggleTrash] = useState(false)

  useEffect(() => {
    const setup = async () => {
      await Tone.start();
      synthRef.current = new Tone.Synth().toDestination();
      setReady(true);
    };

    setup();

    return () => {
      if (synthRef.current) synthRef.current.dispose();
    };
  }, [start]);

  return (
    <FlexBox h='100dvh' w='100dvw' bg='none' ai='flex-start' dir='column'>
      
      {!ready &&
        <FlexBox bg='none'> 
          <button onClick={() => setStart(prev => prev +1)}>Start</button>
        </FlexBox>
      }

      <FlexBox h='50%' w='100%' bg='none'>
        {ready && <TabBuilder synth={synthRef.current} />}
      </FlexBox>


      <FlexBox id='note-trash-parent' h='50%' w='100%'>
        <button onClick={() => setToggleTrash(prev => !prev)}>Trash</button>
       {toggleTrash && <NoteTrash toggleTrash={toggleTrash}/>}
      </FlexBox>

      <FlexBox h='50%' w='100%'>
        <Notes synth={synthRef.current}/> 
      </FlexBox>


    </FlexBox>
  );
}

export default App;