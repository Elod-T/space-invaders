import React from "react";
import Player from "./player";
import BulletManager from "./bulletManager";
import AlienManager from "./alienManager";
import IBulletProps from "./bullet";

interface ICanvasProps {
  width: number;
  height: number;
}

interface ICanvasState {
  playerRef: React.RefObject<Player>;
  bulletManagerRef: React.RefObject<BulletManager>;
  alienManagerRef: React.RefObject<AlienManager>;
}

export default class Canvas extends React.Component<
  ICanvasProps,
  ICanvasState
> {
  constructor(props: ICanvasProps) {
    super(props);
    this.state = {
      playerRef: React.createRef<Player>(),
      bulletManagerRef: React.createRef<BulletManager>(),
      alienManagerRef: React.createRef<AlienManager>(),
    };
  }

  componentDidMount(): void {
    this.update();
  }

  update() {
    setInterval(() => {
      this.state.playerRef.current?.update();
      this.state.bulletManagerRef.current?.update();
      this.state.alienManagerRef.current?.update();
    }, 20);
  }

  render() {
    return (
      <div
        className="relative bg-black"
        style={{
          width: this.props.width,
          height: this.props.height,
        }}
      >
        <Player
          ref={this.state.playerRef}
          x={this.props.width / 2 - 25}
          y={50}
          canvasWidth={this.props.width}
        />
        <BulletManager
          ref={this.state.bulletManagerRef}
          canvasHeight={this.props.height}
          canvasWidth={this.props.width}
          playerRef={this.state.playerRef}
        />
        <AlienManager
          ref={this.state.alienManagerRef}
          canvasHeight={this.props.height}
          canvasWidth={this.props.width}
          playerRef={this.state.playerRef}
          bulletManagerRef={this.state.bulletManagerRef}
        />
      </div>
    );
  }
}
