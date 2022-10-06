import React from "react";

interface IMenuProps {
  gameState: string;
  timer: number;
}

export default class Menu extends React.PureComponent<IMenuProps> {
  constructor(props: IMenuProps) {
    super(props);
  }

  renderMenu(title: string, colors: string[]) {
    return (
      <div>
        <div
          className={
            colors[0] +
            " absolute w-72 h-72 rounded-full mix-blend-lighter filter blur-xl opacity-70 animate-blob top-[35%] left-[20%]"
          }
        ></div>
        <div
          className={
            colors[1] +
            " absolute w-72 h-72 rounded-full mix-blend-lighter filter blur-xl opacity-70 animate-blob animation-delay-8000 top-[40%] left-[30%]"
          }
        ></div>
        <div
          className={
            colors[2] +
            " absolute w-72 h-72 rounded-full mix-blend-lighter filter blur-xl opacity-70 animate-blob animation-delay-4000 top-[35%] left-[40%]"
          }
        ></div>

        <div className="absolute bg-black text-white bg-opacity-90 rounded-full py-4 px-10 w-max text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-4xl font-bold mb-3">{title}</h1>
          <div className="text-2xl mb-4">
            {this.props.timer == 0 ? "" : this.props.timer.toFixed(2) + "s"}
          </div>
          <span className="text-xl">Press</span>
          <kbd className="text-xl kbd mx-1">Enter</kbd>
          <span className="text-xl mr-2">
            {"to play " + (this.props.timer == 0 ? "" : "again")}
          </span>
        </div>
      </div>
    );
  }

  getRightMenu() {
    switch (this.props.gameState) {
      case "starting":
        return this.renderMenu("Space Invaders", [
          "bg-lime-400",
          "bg-green-400",
          "bg-yellow-400",
        ]);
      case "win":
        return this.renderMenu("You Won!", [
          "bg-green-400",
          "bg-lime-400",
          "bg-yellow-400",
        ]);
      case "lose":
        return this.renderMenu("You Lost!", [
          "bg-red-400",
          "bg-red-800",
          "bg-red-600",
        ]);
      default:
        return null;
    }
  }

  render() {
    return <div id="menu">{this.getRightMenu()}</div>;
  }
}
