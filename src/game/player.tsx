import React from "react";

interface IPlayerProps {
  x: number;
  y: number;
  canvasWidth: number;
  speed: number;
}

interface IPlayerState {
  nextMove: number;
  x: number;
  y: number;
  hp: number;
  lives: number;
}

export default class Player extends React.PureComponent<
  IPlayerProps,
  IPlayerState
> {
  constructor(props: IPlayerProps) {
    super(props);
    this.state = {
      x: props.x,
      y: props.y,
      nextMove: 0,
      hp: 100,
      lives: 3,
    };
    this.update = this.update.bind(this);
    this.move = this.move.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        this.setState(() => {
          return { nextMove: -this.props.speed };
        });
        break;
      case "ArrowRight":
        this.setState(() => {
          return { nextMove: this.props.speed };
        });
        break;
    }
  }

  move(direction: string) {
    if (direction === "left") {
      this.setState({
        nextMove: -10,
      });
    } else if (direction === "right") {
      this.setState({
        nextMove: 10,
      });
    }
  }

  update() {
    if (
      this.state.nextMove !== 0 &&
      this.state.x + this.state.nextMove > 0 &&
      this.state.x + this.state.nextMove < this.props.canvasWidth - 50
    ) {
      this.setState({
        x: this.state.x + this.state.nextMove,
        nextMove: 0,
      });
    }
  }

  render() {
    return (
      <div
        className="absolute z-50"
        style={{
          width: 50,
          height: 30,
          left: this.state.x,
          bottom: this.state.y,
          backgroundImage: "url(/ship.png)",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    );
  }
}
