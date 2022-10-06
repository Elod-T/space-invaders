import React from "react";
import { v4 as uuidv4 } from "uuid";

export interface IBulletProps {
  id: ReturnType<typeof uuidv4>;
  damage: number;
  x: number;
  y: number;
  canvasHeight: number;
}

export default class Bullet extends React.PureComponent<IBulletProps> {
  constructor(props: IBulletProps) {
    super(props);
  }

  render() {
    return (
      <div
        id={this.props.id}
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
