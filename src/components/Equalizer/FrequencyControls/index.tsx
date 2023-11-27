import React, { useEffect, useState } from "react";
import "./styles.scss";

type FreqFilters = Record<string, number>;

const defaultFilters: FreqFilters = {
  "60": 0,
  "120": 0,
  "250": 0,
  "500": 0,
  "1000": 0,
  "2000": 0,
  "4000": 0,
  "8000": 0,
};

const defaultFreqs = Array.from(Object.keys(defaultFilters));

export type FrequencyControlsInitCallback = (
  firstNode: AudioNode,
  lastNode: AudioNode
) => void;

type FrequencyControlsProps = {
  audioContext: AudioContext;
  onInit?: FrequencyControlsInitCallback;
};

type FiltresMap = Record<string, BiquadFilterNode>;

const FrequencyControls: React.FC<FrequencyControlsProps> = ({
  audioContext,
  onInit,
}) => {
  const [filterValuesMap, setFilterValuesMap] =
    useState<FreqFilters>(defaultFilters);
  const [nodesMap, setNodesMap] = useState<FiltresMap>();
  const [freqs] = useState<string[]>(defaultFreqs);

  useEffect(() => {
    const nodesStack = [];
    const newNodesMap: FiltresMap = {};
    for (const [index, freqString] of freqs.entries()) {
      const bfNode = audioContext.createBiquadFilter();

      bfNode.type = "peaking";
      bfNode.frequency.value = Number(freqString);
      bfNode.Q.value = 0.5;

      nodesStack.push(bfNode);
      newNodesMap[freqString] = bfNode;
      if (index > 0) {
        const prevBfNode = nodesStack[index - 1];
        prevBfNode.connect(bfNode);
      }
    }
    setNodesMap(newNodesMap);
    if (onInit) {
      const firstNode = nodesStack[0];
      const lastNode = nodesStack[nodesStack.length - 1];
      onInit(firstNode, lastNode);
    }
  }, []);

  const onRangeChange = (freqKey: string, value: number) => {
    setFilterValuesMap((prev) => ({
      ...prev,
      [freqKey]: value,
    }));
    nodesMap?.[freqKey]?.gain?.setValueAtTime(value, audioContext.currentTime);
  };

  return (
    <>
      <div className="freq-controls">
        {freqs.map((freq, index) => (
          <div className="freq-slider" key={index}>
            Hz
            <input type="text" value={freq} readOnly />
            <input
              className="freq-slider--input"
              type="range"
              onChange={(event) =>
                onRangeChange(String(freq), Number(event.target.value))
              }
              min={-50}
              max={50}
              defaultValue={filterValuesMap[freq]}
              step={5}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default FrequencyControls;
