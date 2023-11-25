import { useEffect, useRef, useState } from "react";
import "./App.css";
import exampleAudio from "./assets/sound/example.mp3";
import Equalizer from "./components/Equalizer";

interface CapturableHTMLAudioElement extends HTMLAudioElement {
  captureStream(): MediaStream;
}

function App() {
  const audioRef = useRef<CapturableHTMLAudioElement>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Due to browser policy, it is necessary
  // to wait until the user interacts with the page.
  // So, we can't run Equalizer immediately in onPlay callback
  useEffect(() => {
    if (isReady) {
      const stream = audioRef.current!.captureStream();
      setAudioStream(stream);
    }
  }, [isReady]);

  return (
    <>
      <h1>AquaLizer</h1>
      {audioStream && isReady && <Equalizer stream={audioStream} />}
      <div className="card">
        <audio onPlay={() => setIsReady(true)} loop controls ref={audioRef}>
          <source src={exampleAudio} type="audio/mp3" />
        </audio>
      </div>
    </>
  );
}

export default App;
