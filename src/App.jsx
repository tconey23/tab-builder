import { useRef, useEffect, useState } from 'react';
import TabBuilder from './components/TabBuilder';
import * as Tone from 'tone';
import Notes from './components/Notes'; 
import FlexBox from './elements/FlexBox';
import { motion, AnimatePresence } from 'framer-motion';
import "@flaticon/flaticon-uicons/css/all/all.css"
import Button from './components/Button';
import ChordBuilder from './components/ChordBuilder';

const MotionFlex = motion(FlexBox)

function App() {
  const synthRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [start, setStart] = useState(0)
  const [toggleMenu, setToggleMenu] = useState(0)

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
    <FlexBox h='100svh' w='100dvw' bg='none' ai='center' dir='column' jc='flex-start'>
      <AnimatePresence>
        <FlexBox w='100%' jc='flex-start'>
          <Button clk={() => setToggleMenu(0)} st={{alignSelf: 'flex-start', marginLeft: '5px', marginTop: '5px'}}>
            <i className="fi fi-br-menu-burger"></i>
          </Button>
          {toggleMenu == 0 && 
            <MotionFlex
              w='90%'
              oy='hidden'
              initial={{height: 0, opacity: 0}}
              animate={{height: '100%', opacity: 1}}
              exit={{height: 0, opacity: 0}}
              transition={{duration: 1.5}}
            >
              {!ready &&
                <FlexBox bg='none'> 
                  <button onClick={() => setStart(prev => prev +1)}>Start</button>
                </FlexBox>
              }

              <FlexBox h='50%' w='100%' bg='none'>
                {ready && <TabBuilder synth={synthRef.current} />}
              </FlexBox>

              <FlexBox h='50%' w='100%'>
                <Notes synth={synthRef.current}/> 
              </FlexBox>
            </MotionFlex>
          }
        </FlexBox>
        <FlexBox w='100%'>
          <Button clk={() => setToggleMenu(1)} st={{alignSelf: 'flex-start', marginLeft: '5px', marginTop: '5px'}}>
            <i className="fi fi-br-menu-burger"></i>
          </Button>
          {toggleMenu == 1 && 
            <MotionFlex
              w='90%'
              oy='hidden'
              initial={{height: 0, opacity: 0}}
              animate={{height: '100%', opacity: 1}}
              exit={{height: 0, opacity: 0}}
              transition={{duration: 1.5}}
            >
              <FlexBox h='50%' w='100%'>
                <ChordBuilder />
              </FlexBox>
            </MotionFlex>
          }
        </FlexBox>
      </AnimatePresence>


    </FlexBox>
  );
}

export default App;