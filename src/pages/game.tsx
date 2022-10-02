import React from "react";
import Canvas from "../game/canvas";

interface IGameProps {}

interface IGameState {
  canvasRef: React.RefObject<Canvas>;
}

export default class Game extends React.Component<IGameProps, IGameState> {
  constructor(props: IGameProps) {
    super(props);
    this.state = {
      canvasRef: React.createRef<Canvas>(),
    };
  }

  render() {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <Canvas ref={this.state.canvasRef} width={800} height={800} />
      </div>
    );
  }
}
