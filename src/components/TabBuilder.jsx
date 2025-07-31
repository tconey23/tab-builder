import { useEffect, useState, useRef } from 'react';
import FlexBox from '../elements/FlexBox';
import * as Tone from 'tone';
import Text from '../elements/Text';
import TextInput from '../elements/TextInput';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import "@flaticon/flaticon-uicons/css/all/all.css"

const MotionFlex = motion(FlexBox)

const TabBuilder = ({ synth }) => {
  const [timeline, setTimeline] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [clickTrack, setClickTrack] = useState(true)
  const [reopenUrl, setReopenUrl] = useState(null)
  const [reqSave, setReqSave] = useState(false)
  const [reqLoad, setReqLoad] = useState(false)
  const [saveFileName, setSaveFileName] = useState('')
  const [savedTimelines, setSavedTimelines] = useState([])
  const [selectedTimeline, setSelectedTimeline] = useState(null)
  const [toggleMenu, setToggleMenu] = useState(false)
  const [bpm, setBpm] = useState(120)

  const saveIconRef = useRef(null)

  const metronomeRef = useRef(null);

const loadTimelineFromLocalStorage = (name) => {
  const saved = localStorage.getItem(`savedTimeline_${name}`);
  if (!saved) {
    alert(`No timeline found for name: ${name}`);
    return;
  }

  const { bpm: savedBpm, timeline: savedTimeline } = JSON.parse(saved);

  setBpm(savedBpm);
  setTimeline(savedTimeline.map(([time, event]) => event));
};

  const saveTimeline = (name = "Unnamed Part") => {
  let currentTime = 0;

  const fullEvents = timeline.map((event, index) => {
    const eventTime = currentTime;
    const duration = Tone.Time(event.length).toSeconds();
    currentTime += duration;

    return [eventTime, { ...event, index }];
  });

  const payload = {
    name,
    bpm,
    timeline: fullEvents,
  };

  localStorage.setItem(`savedTimeline_${name}`, JSON.stringify(payload));
  alert(`Saved "${name}" to localStorage`);
  setSaveFileName('')
  setReqSave(false)
};

  const loadSavedTimeline = async (savedPartEvents) => {

  const data = await fetch(savedPartEvents)
  const part = await data.json()

  console.log(part)

  const newTimeline = part?.timeline?.map(([_, data]) => ({
    type: "note",
    note: data.note,
    length: data.length,
    url: data.url,
    canPlay: true
  }));
  setTimeline(newTimeline);
};

useEffect(() =>{
  if(reopenUrl){
    loadSavedTimeline(reopenUrl)
  }
}, [reopenUrl])

  const startClick = () => {
    Tone.Transport.bpm.value = bpm;

    if (!metronomeRef.current) {
      const metronome = new Tone.Loop((time) => {
        new Tone.MembraneSynth().toDestination().triggerAttackRelease("C2", "8n", time);
      }, "4n");

      metronomeRef.current = metronome;
      metronome.start(0);
    }
  };

const playTimeline = async () => {
  await Tone.start();
  Tone.Transport.bpm.value = bpm
  Tone.Transport.cancel();
  Tone.Transport.stop();
  Tone.Transport.position = 0;

  let currentTime = 0;
const partEvents = timeline.map((event, index) => {
  const eventTime = currentTime;
  const duration = Tone.Time(event.length).toSeconds();
  currentTime += duration;

  if (event.type === 'note') {
    return [eventTime, { note: event.note, length: event.length, index, url: event.url }];
  } else {
    return null;
  }
}).filter(Boolean);


const part = new Tone.Part((time, value) => {
  if (value.url) {
    const audio = new Audio(value.url);
    audio.play();
  } else {
    synth.triggerAttackRelease(value.note, value.length, time);
  }
  setCurrentNote(value.index);
}, partEvents);

  part.start(0);
  if(clickTrack){startClick(Tone)}
  Tone.Transport.start();

  Tone.Transport.scheduleOnce(() => {
    setCurrentNote(null);

    // Stop metronome loop if it exists
    if (metronomeRef.current) {
      metronomeRef.current.stop();
      metronomeRef.current.cancel();
      metronomeRef.current = null;
    }
  }, `+${currentTime}`);

};


const handleDrop = (e, targetIndex) => {
  e.preventDefault();

  const type = e.dataTransfer.getData("type");
  const source = e.dataTransfer.getData("source");
  const sourceIndex = parseInt(e.dataTransfer.getData("index"));
  const noteData = e.dataTransfer.getData("noteData");
  const parsedNote = noteData ? JSON.parse(noteData) : null;

  let newItem;
  if (type === "note" && parsedNote) {
    newItem = {
      type: "note",
      note: parsedNote.note,
      length: parsedNote.length || "4n",
      url: parsedNote.url,
      canPlay: parsedNote.canPlay,
    };
  } else if (type === "rest") {
    const length = e.dataTransfer.getData("length") || "4n";
    newItem = { type: "rest", length };
  } else {
    return;
  }

  setTimeline((prev) => {
    const updated = [...prev];
    updated.push(newItem)
    return updated;
  });
};


  const allowDrop = (e) => {
    e.preventDefault();
  };

const handleTimelineDragStart = (e, index) => {
  const noteObj = timeline[index];
  e.dataTransfer.setData("noteData", JSON.stringify(noteObj)); // ✅ include full object
  e.dataTransfer.setData("type", noteObj.type);
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

  const getlength = (i) => {
    return timeline[i].length
  }

  const getWidth = (i) =>{
    let noteLength = timeline[i].length.replace(/\D/g, '')
    return `${600 / noteLength}px`

  }

const changeLength = (i, newLength) => {
  setTimeline((prev) => {
    const updated = [...prev]
    updated[i] = { ...updated[i], length: newLength }
    return updated
  });
};

  const removeNote = (index) => {
    const newTimeline = timeline.filter((_, i) => i !== index)
    setTimeline(newTimeline)
  }

  const getSavedTimelines =  () => {

    const savedTimelines = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes('savedTimeline_')) {
          const value = localStorage.getItem(key);
          try {
            const parsed = JSON.parse(value);
            savedTimelines.push({ key, ...parsed });
          } catch (e) {
            console.warn(`Could not parse saved timeline for key: ${key}`);
          }
        }
      }

      console.log(savedTimelines);
      setSavedTimelines(savedTimelines);

  }

  useEffect(() => {
    if(reqLoad){
      getSavedTimelines()
    }
  }, [reqLoad])

  useEffect(() => {
    console.log(selectedTimeline)
  }, [selectedTimeline])

  return (
    <FlexBox w='95%'>
      <FlexBox>

      <FlexBox dir='row'>
        <FlexBox>
          <Button ref={saveIconRef} clk={() => setToggleMenu(prev => !prev)}><i className="fi fi-br-menu-burger"></i></Button>
        </FlexBox>

        <FlexBox w="100%" jc="center" ai="center" my={2}>
          <button onClick={playTimeline}>▶ Play Timeline</button>
        </FlexBox>
      </FlexBox>
        {selectedTimeline && <Text>{selectedTimeline.name}</Text>}
      </FlexBox>
      <FlexBox w="100%" h="200px" bg="#eee" jc="flex-start" dir="row" onDrop={handleDrop} onDragOver={allowDrop}>
        {timeline.map((event, index) => (
          <FlexBox
          key={index}
          drg={true}
          onDragStart={(e) => handleTimelineDragStart(e, index)} 
          w={getWidth(index)}
          h="100%"
          mx={1}
          bg={currentNote === index ? 'purple' : 'tomato'}
          jc="center"
          ai="center"
          >
            <select value={getlength(index)} onChange={(e) => changeLength(index, e.target.value)} style={{width: '90%', maxWidth: '50px'}}>
              <option value="1n">1n</option>
              <option value="2n">2n</option>
              <option value="4n">4n</option>
              <option value="8n">8n</option>
              <option value="16n">16n</option>
            </select>
            
            <i onClick={() => removeNote(index)} style={{fontSize: '20px', color: 'whitesmoke', cursor: 'pointer'}} className="fi fi-sr-cross-circle"></i>
        
            <p>{event.note}</p>

          </FlexBox>
        ))}
      </FlexBox>

      <AnimatePresence>
        {toggleMenu && (
          <MotionFlex
            dir='row'
            oy='hidden'
            w='80%'
            bx='5px 5px 10px 3px grey'
            br={5}
            st={{ position: 'absolute', top: `${saveIconRef?.current?.offsetTop + 45}px`}}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '30%', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 3 }}
          >
            {reqSave ? (
              <FlexBox>
                <Text>Save?</Text>
                <TextInput v={saveFileName} onChange={(e) => setSaveFileName(e.target.value)} />
                <Button clk={() => saveTimeline(saveFileName)}>Save</Button>
                <Button clk={() => setReqSave(false)}>Cancel</Button>
              </FlexBox>
            ) : (
              <Button clk={() => setReqSave(true)}>Save</Button>
            )}
            {reqLoad ? (
              <FlexBox>
                <Text>Load?</Text>
               <select 
                value={selectedTimeline?.key || ''} 
                onChange={(e) => {
                  const selected = savedTimelines.find(t => t.key === e.target.value);
                  setSelectedTimeline(selected);
                }}
              >
                <option value="" disabled>Select a saved timeline</option>
                {savedTimelines.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.name}
                  </option>
                ))}
              </select>

                {selectedTimeline && (
                  <Button clk={() => loadTimelineFromLocalStorage(selectedTimeline.name)}>Load</Button>
                )}
                <Button clk={() => setReqLoad(false)}>Cancel</Button>
              </FlexBox>
            ) : (
              <Button clk={() => setReqLoad(true)}>Load</Button>
            )}
          <button onClick={() => setClickTrack((prev) => !prev)}>
            {clickTrack ? 'Disable' : 'Enable'} Click Track
          </button>
          </MotionFlex>
        )}
      </AnimatePresence>
      
      
    </FlexBox>
  );
};

export default TabBuilder;