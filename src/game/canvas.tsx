import React from "react";
import { v4 as uuidv4 } from "uuid";
import Player from "./player";
import BulletManager from "./bulletManager";
import AlienManager from "./alienManager";
import Hud from "./hud";
import Menu from "./menu";

interface ICanvasProps {
  fps: number;
  shootFrequency: number;
  width: number;
  height: number;
}

interface ICanvasState {
  gameState: string;
  gameLoop: ReturnType<typeof setInterval> | null;
  timer: number;
  iterations: number;
  playerRef: React.RefObject<Player>;
  bulletManagerRef: React.RefObject<BulletManager>;
  alienManagerRef: React.RefObject<AlienManager>;
  keys: ReturnType<typeof uuidv4>[];
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
      timer: 0,
      iterations: 0,
      playerRef: React.createRef<Player>(),
      bulletManagerRef: React.createRef<BulletManager>(),
      alienManagerRef: React.createRef<AlienManager>(),
      keys: [uuidv4(), uuidv4(), uuidv4()],
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

  resetKeys() {
    this.setState({ keys: [uuidv4(), uuidv4(), uuidv4()] });
  }

  listenForEnter() {
    document.addEventListener("keydown", (e) => this.startGame(e));
  }

  startGame(event: KeyboardEvent) {
    if (
      event.key === "Enter" &&
      "starting win lose".includes(this.state.gameState)
    ) {
      const menu = document.getElementById("menu");
      const canvas = document.getElementById("canvas");
      const hud = document.getElementById("hud");

      if (!menu || !canvas || !hud) {
        return;
      }

      menu.classList.remove("animate-fade-in");
      menu.classList.add("animate-fade-out");

      setTimeout(() => {
        canvas.classList.remove("animate-sharpen-out");
        canvas.classList.add("animate-sharpen-in");

        hud.classList.remove("animate-sharpen-out");
        hud.classList.add("animate-sharpen-in");
      }, 1500);

      setTimeout(() => {
        this.setState({ gameState: "playing", timer: 0 });
      }, 3000);
    }
  }

  animateGameEnd() {
    const menu = document.getElementById("menu");
    const canvas = document.getElementById("canvas");
    const hud = document.getElementById("hud");

    if (!menu || !canvas || !hud) {
      return;
    }

    menu.classList.remove("animate-fade-out");
    menu.classList.add("animate-fade-in");

    hud.classList.add("animate-sharpen-out");
    hud.classList.remove("animate-sharpen-in");

    canvas.classList.add("animate-sharpen-out");
    canvas.classList.remove("animate-sharpen-in");
  }

  update() {
    this.setState({
      gameLoop: setInterval(() => {
        if (this.state.gameState === "playing") {
          this.state.playerRef.current?.update();
          this.state.bulletManagerRef.current?.update();
          this.state.alienManagerRef.current?.update();

          if (
            this.state.iterations %
              (this.props.fps / this.props.shootFrequency) ===
            0
          ) {
            this.state.bulletManagerRef.current?.shoot();
          }

          if (this.state.alienManagerRef.current?.state.aliens.length === 0) {
            this.setState({ gameState: "win" });
            this.animateGameEnd();
            this.resetKeys();
          }

          if (
            this.state.playerRef.current?.state.lives === 0 ||
            this.state.alienManagerRef.current?.getLowestY()! <=
              this.state.playerRef.current?.state.y! + 50
          ) {
            this.setState({ gameState: "lose" });
            this.animateGameEnd();
            this.resetKeys();
          }

          this.setState({
            timer: this.state.timer + 1000 / this.props.fps,
            iterations:
              (this.state.iterations + 1) %
              (this.props.fps / this.props.shootFrequency),
          });
        }
      }, 1000 / this.props.fps),
    });
  }

  render() {
    return (
      <div>
        <div
          id="canvas"
          className="blur relative bg-black"
          style={{
            width: this.props.width,
            height: this.props.height,
          }}
        >
          <Player
            key={this.state.keys[0]}
            ref={this.state.playerRef}
            x={this.props.width / 2 - 25}
            y={50}
            canvasWidth={this.props.width}
          />

          <BulletManager
            key={this.state.keys[1]}
            ref={this.state.bulletManagerRef}
            canvasHeight={this.props.height}
            canvasWidth={this.props.width}
            playerRef={this.state.playerRef}
          />

          <AlienManager
            key={this.state.keys[2]}
            ref={this.state.alienManagerRef}
            canvasHeight={this.props.height}
            canvasWidth={this.props.width}
            playerRef={this.state.playerRef}
            bulletManagerRef={this.state.bulletManagerRef}
          />
        </div>

        <Menu gameState={this.state.gameState} timer={this.state.timer} />
        <Hud
          score={this.state.alienManagerRef.current?.state.aliens.length || 0}
          timer={this.state.timer / 1000}
          lives={this.state.playerRef.current?.state.lives || 0}
        />
      </div>
    );
  }
}
