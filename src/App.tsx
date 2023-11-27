import { useEffect, useRef, useState } from "react";
import "./App.css";
import exampleAudio from "./assets/sound/example.mp3";
import Equalizer from "./components/Equalizer";

function App() {
  const [arrayBuffer, setAudioBuffer] = useState<ArrayBuffer>();
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    fetch(exampleAudio)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => setAudioBuffer(arrayBuffer))
    
  }, []);

  return (
    <>
      <h1>AquaLizer</h1>
      {!isReady && <button onClick={() =>  setIsReady(true)}>Play!</button>}
      {isReady && arrayBuffer && <Equalizer buffer={arrayBuffer} />}
    </>
  );
}

export default App;
