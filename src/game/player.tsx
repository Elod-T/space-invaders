import React from "react";

interface IPlayerProps {
  x: number;
  y: number;
  canvasWidth: number;
}

interface IPlayerState {
  nextMove: number;
  x: number;
  y: number;
}

export default class Player extends React.Component<
  IPlayerProps,
  IPlayerState
> {
  constructor(props: IPlayerProps) {
    super(props);
    this.state = {
      x: props.x,
      y: props.y,
      nextMove: 0,
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.update = this.update.bind(this);
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
          return { nextMove: -10 };
        });
        break;
      case "ArrowRight":
        this.setState(() => {
          return { nextMove: 10 };
        });
        break;
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
