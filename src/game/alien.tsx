import React from "react";

export interface IAlienProps {
  x: number;
  y: number;
  hp: number;
}

export default class Alien extends React.Component<IAlienProps> {
  constructor(props: IAlienProps) {
    super(props);
  }

  render() {
    return (
      <div
        className="absolute z-0"
        style={{
          width: 40,
          height: 40,
          left: this.props.x,
          bottom: this.props.y,
          backgroundImage: "url(./alien.png)",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    );
  }
}
