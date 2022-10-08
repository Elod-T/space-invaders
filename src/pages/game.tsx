import React from "react";
import Canvas from "../game/canvas";

interface IGameProps {}

interface IGameState {}

export default class Game extends React.Component<IGameProps, IGameState> {
  constructor(props: IGameProps) {
    super(props);
  }

  render() {
    return (
      <div className="card shadow-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <Canvas
          width={800}
          height={800}
          shootFrequency={1}
          fps={60}
          control="tensorflow"
          volume={0.3}
        />
      </div>
    );
  }
}
