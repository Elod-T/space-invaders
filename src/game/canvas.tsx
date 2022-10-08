import React from "react";
import { v4 as uuidv4 } from "uuid";
import Player from "./player";
import BulletManager from "./bulletManager";
import AlienManager from "./alienManager";
import Hud from "./hud";
import Menu from "./menu";
import Tensor from "../tensorflow/tensor";

interface ICanvasProps {
  fps: number;
  shootFrequency: number;
  width: number;
  height: number;
  control: "keyboard" | "tensorflow";
  volume: number;
}

interface ICanvasState {
  gameState: string;
  gameLoop: ReturnType<typeof setInterval> | null;
  timer: number;
  iterations: number;
  playerRef: React.RefObject<Player>;
  bulletManagerRef: React.RefObject<BulletManager>;
  alienManagerRef: React.RefObject<AlienManager>;
  tensorRef: React.RefObject<Tensor>;
  keys: ReturnType<typeof uuidv4>[];
  themeAudio: HTMLAudioElement;
  handRaiseAudio: HTMLAudioElement;
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
      tensorRef: React.createRef<Tensor>(),
      keys: [uuidv4(), uuidv4(), uuidv4()],
      themeAudio: new Audio("/audio/theme.mp3"),
      handRaiseAudio: new Audio("/audio/hand_raise.wav"),
    };
  }

  componentDidMount() {
    switch (this.props.control) {
      case "keyboard":
        this.listenForEnter();
        break;
      case "tensorflow":
        this.preGameUpdater();
        break;
    }

    this.update();

    // we wait so that the iframe has time to load and trigger the autoplay policy, after that we can play the audio
    setTimeout(() => {
      this.state.themeAudio.volume = this.props.volume;
      this.state.themeAudio.loop = true;
      this.state.themeAudio.play();
    }, 1000);
  }

  componentWillUnmount() {
    if (this.state.gameLoop) {
      clearInterval(this.state.gameLoop);
    }
    this.state.themeAudio.pause();
  }

  resetKeys() {
    this.setState({ keys: [uuidv4(), uuidv4(), uuidv4()] });
  }

  checkRightHandHold() {
    const checker = setInterval(() => {
      const circle = document.getElementById("response");

      if (this.state.tensorRef.current?.state.right) {
        const rightWrist = document.getElementById("right_wrist");

        if (circle && rightWrist) {
          this.state.handRaiseAudio.play();

          circle.classList.remove("hidden");
          circle.style.right =
            Number(rightWrist.style.left.replace("px", "")) - 25 + "px";
          circle.style.top =
            Number(rightWrist.style.top.replace("px", "")) + 375 + "px";
        }
      } else {
        this.state.handRaiseAudio.pause();
        circle?.classList.add("hidden");
      }
      if (
        this.state.tensorRef.current?.state.rightCount &&
        this.state.tensorRef.current?.state.rightCount > this.props.fps * 2
      ) {
        this.startGame({ key: "Enter" } as KeyboardEvent);
        clearInterval(checker);

        circle?.classList.add("hidden");
      }
    }, 1000 / this.props.fps);
  }

  listenForEnter() {
    document.addEventListener("keydown", (e) => this.startGame(e));
  }

  startGame(event: KeyboardEvent) {
    if (event.key === "Enter" && this.state.gameState != "playing") {
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

  checkGameEnd() {
    if (this.state.alienManagerRef.current?.state.aliens.length === 0) {
      this.setState({ gameState: "win" });
      this.animateGameEnd();
      this.preGameUpdater();
      this.resetKeys();
    }

    if (
      this.state.playerRef.current?.state.lives === 0 ||
      this.state.alienManagerRef.current?.getLowestY()! <=
        this.state.playerRef.current?.state.y! + 50
    ) {
      this.setState({ gameState: "lose" });
      this.animateGameEnd();
      this.preGameUpdater();
      this.resetKeys();
    }
  }

  preGameUpdater() {
    const updater = setInterval(() => {
      this.state.tensorRef.current?.update();
      if (this.state.gameState == "playing") {
        clearInterval(updater);
      }
    }, 1000 / this.props.fps);
    this.checkRightHandHold();
  }

  update() {
    this.setState({
      gameLoop: setInterval(() => {
        if (this.state.gameState === "playing") {
          this.state.tensorRef.current?.update();
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

          this.checkGameEnd();

          if (this.state.tensorRef.current?.state.left) {
            this.state.playerRef.current?.move("left");
          }

          if (this.state.tensorRef.current?.state.right) {
            this.state.playerRef.current?.move("right");
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
            speed={this.props.control === "keyboard" ? 10 : 1}
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
            volume={this.props.volume}
          />

          <AlienManager
            key={this.state.keys[2]}
            ref={this.state.alienManagerRef}
            canvasHeight={this.props.height}
            canvasWidth={this.props.width}
            playerRef={this.state.playerRef}
            bulletManagerRef={this.state.bulletManagerRef}
            volume={this.props.volume}
          />
        </div>

        <Menu
          gameState={this.state.gameState}
          timer={this.state.timer / 1000}
          control={this.props.control}
        />
        <Hud
          score={this.state.alienManagerRef.current?.state.aliens.length || 0}
          timer={this.state.timer / 1000}
          lives={this.state.playerRef.current?.state.lives || 0}
        />

        <Tensor ref={this.state.tensorRef} fps={this.props.fps} />
        <div
          id="response"
          className="absolute rounded-full w-16 h-16 bg-white opacity-10 hidden animate-pulse"
          style={{
            transform: "scale(-1, 1)",
          }}
        ></div>

        <iframe
          src="audio/theme.mp3"
          allow="autoplay" // its not gonna play, but its gonna trigger the autoplay policy so after this from js we can play audio
          id="audio"
          className="hidden"
        ></iframe>
      </div>
    );
  }
}
