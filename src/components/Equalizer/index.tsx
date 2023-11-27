import { useEffect, useMemo, useRef, useState } from "react";
import "./styles.scss";
import FrequencyControls from "./FrequencyControls";

type EqualizerProps = {
  buffer: ArrayBuffer;
};

function Equalizer({ buffer }: EqualizerProps) {
  const [sourceNode, setSourceNode] = useState<AudioNode>();
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>();
  const [onControlsIsReady, setOnControlsIsReady] =
    useState<(node: AudioNode) => void>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const audioContext = useMemo(() => {
    return new AudioContext();
  }, []);

  useEffect(() => {
    audioContext.decodeAudioData(buffer).then((audioBuffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      setSourceNode(source);
      source.start(0);
    });
  }, []);

  useEffect(() => {
    const draw = () => {
      if (canvasRef.current && analyserNode) {
        const canvasContext = canvasRef.current.getContext("2d");
        if (canvasContext) {
          const WIDTH = canvasRef.current.width;
          const HEIGHT = canvasRef.current.height;
          const bufferLength = analyserNode.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserNode.getByteFrequencyData(dataArray);
          canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

          let barWidth = (WIDTH / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            canvasContext.fillStyle = "rgb(" + (barHeight + 100) + ", 50, 50)";
            canvasContext.fillRect(
              x,
              HEIGHT - barHeight / 2,
              barWidth,
              barHeight / 2
            );
            x += barWidth + 1;
          }
        }
      }
      requestAnimationFrame(draw);
    };

    draw();
  }, [analyserNode]);

  useEffect(() => {
    if (sourceNode && onControlsIsReady) {
      onControlsIsReady(sourceNode);
    }
  }, [sourceNode, onControlsIsReady]);

  const onFreqControlsInit = (firstNode: AudioNode, lastNode: AudioNode) => {
    const callback = (srcNode: AudioNode) => {
      const analyserNode = audioContext.createAnalyser();
      console.trace("sdfsdfsdf", srcNode);
      srcNode.connect(firstNode);
      lastNode.connect(analyserNode);
      analyserNode.connect(audioContext.destination);
      setAnalyserNode(analyserNode);

      // const analyserNode = audioContext.createAnalyser();
      // srcNode.connect(analyserNode);
      // analyserNode.connect(audioContext.destination);
      // setAnalyserNode(analyserNode);
    }
    setOnControlsIsReady(() => callback)
  };

  return (
    <div>
      <div>
        <FrequencyControls
          audioContext={audioContext}
          onInit={onFreqControlsInit}
        />
      </div>
      <canvas ref={canvasRef} width="800" height="301" />
    </div>
  );
}

export default Equalizer;
