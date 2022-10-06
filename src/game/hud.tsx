import React from "react";

interface IHudProps {
  score: number;
  timer: number;
  lives: number;
}

export default class Hud extends React.PureComponent<IHudProps> {
  constructor(props: IHudProps) {
    super(props);
  }

  render() {
    return (
      <div
        id="hud"
        className="blur absolute top-0 left-0 w-full h-full flex flex-col justify-between"
      >
        <div className="flex justify-between px-4 py-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
            <span className="text-white text-xl">{this.props.score}</span>
          </div>
          <div className="flex items-center">
            <span className="text-white text-xl">
              {this.props.timer.toFixed(2)}s
            </span>
            <div className="w-4 h-4 bg-yellow-400 rounded-full ml-2"></div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-4 h-4 bg-red-400 rounded-full mr-2"></div>
          <span className="text-white text-xl">{this.props.lives}</span>
        </div>
      </div>
    );
  }
}
