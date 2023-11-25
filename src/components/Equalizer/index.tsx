import { useEffect, useMemo, useRef, useState } from "react";

type EqualizerProps = {
  stream: MediaStream;
};

function Equalizer({ stream }: EqualizerProps) {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>();
  const sourceNode = useRef<MediaStreamAudioSourceNode>();
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const audioContext = useMemo(() => {
    return new AudioContext();
  }, []);

  useEffect(() => {
    const source = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    source.connect(analyserNode);
    analyserNode.connect(audioContext.destination);

    setAnalyser(analyserNode);
  }, []);

  useEffect(() => {
    const draw = () => {
      if (canvasRef.current && analyser) {
        const canvasContext = canvasRef.current.getContext("2d");
        if (canvasContext) {
          const WIDTH = canvasRef.current.width;
          const HEIGHT = canvasRef.current.height;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);
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
  }, [analyser]);

  return (
    <div>
      <canvas ref={canvasRef} width="800" height="301" />
    </div>
  );
}

export default Equalizer;
