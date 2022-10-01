import React from "react";

export interface IBulletProps {
  damage: number;
  x: number;
  y: number;
  canvasHeight: number;
}

export default class Bullet extends React.Component<IBulletProps> {
  constructor(props: IBulletProps) {
    super(props);
  }

  render() {
    return (
      <div
        className="absolute bg-red-500 z-0"
        style={{
          width: 10,
          height: 10,
          left: this.props.x,
          bottom: this.props.y,
        }}
      ></div>
    );
  }
}
