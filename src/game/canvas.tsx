import React from "react";
import Player from "./player";
import BulletManager from "./bulletManager";
import AlienManager from "./alienManager";

interface ICanvasProps {
  width: number;
  height: number;
}

interface ICanvasState {
  gameState: string;
  gameLoop: ReturnType<typeof setInterval> | null;
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
      gameState: "starting",
      gameLoop: null,
      playerRef: React.createRef<Player>(),
      bulletManagerRef: React.createRef<BulletManager>(),
      alienManagerRef: React.createRef<AlienManager>(),
    };
  }

  componentDidMount() {
    this.listenForEnter();
    this.update();
  }

  componentWillUnmount() {
    if (this.state.gameLoop) {
      clearInterval(this.state.gameLoop);
    }
  }

  listenForEnter() {
    document.addEventListener("keydown", (e) => this.startGame(e));
  }

  startGame(event: KeyboardEvent) {
    if (event.key === "Enter") {
      const startScreen = document.getElementById("startScreen");
      const canvas = document.getElementById("canvas");

      startScreen?.classList.add("animate-fade-out");

      startScreen?.addEventListener("animationend", () => {
        canvas?.classList.add("animate-sharpen-in");
      });

      canvas?.addEventListener("animationend", () => {
        this.setState({ gameState: "playing" });
      });
    }
    document.removeEventListener("keydown", (e) => this.startGame(e));
  }

  update() {
    this.setState({
      gameLoop: setInterval(() => {
        if (this.state.gameState === "playing") {
          this.state.playerRef.current?.update();
          this.state.bulletManagerRef.current?.update();
          this.state.alienManagerRef.current?.update();
        }
      }, 20),
    });
  }

  renderStartingScreen() {
    return (
      <div id="startScreen">
        <div className="absolute w-72 h-72 bg-lime-400 rounded-full mix-blend-lighter filter blur-xl opacity-70 animate-blob top-[35%] left-[20%]"></div>
        <div className="absolute w-72 h-72 bg-green-400 rounded-full mix-blend-lighter filter blur-xl opacity-70 animate-blob animation-delay-8000 top-[40%] left-[30%]"></div>
        <div className="absolute w-72 h-72 bg-yellow-400 rounded-full mix-blend-lighter filter blur-xl opacity-70 animate-blob animation-delay-4000 top-[35%] left-[40%]"></div>

        <div className="absolute bg-black text-white bg-opacity-90 rounded-full py-4 px-10 w-max text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-4xl font-bold mb-3">Space Invaders</h1>
          <span className="text-xl">Press</span>
          <kbd className="text-xl kbd mx-1">Enter</kbd>
          <span className="text-xl mr-2">to start</span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div
          id="canvas"
          className={
            (this.state.gameState == "starting" ? "blur" : "") +
            " relative bg-black"
          }
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
        {this.state.gameState === "starting"
          ? this.renderStartingScreen()
          : null}
      </div>
    );
  }
}
