import React, { ReactElement } from "react";
import Bullet, { IBulletProps } from "./bullet";
import Player from "./player";

interface IBulletManagerProps {
  canvasHeight: number;
  canvasWidth: number;
  playerRef: React.RefObject<Player>;
}

interface IBulletManagerState {
  bullets: IBulletProps[];
}

export default class BulletManager extends React.Component<
  IBulletManagerProps,
  IBulletManagerState
> {
  constructor(props: IBulletManagerProps) {
    super(props);
    this.state = {
      bullets: [],
    };
    this.shoot = this.shoot.bind(this);
    this.update = this.update.bind(this);
    this.getBullets = this.getBullets.bind(this);
    this.setBullets = this.setBullets.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.shoot);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.shoot);
  }

  shoot(event: KeyboardEvent) {
    if (event.key === " ") {
      this.setState((prevState) => {
        const bullet = {
          damage: 100,
          x: this.props.playerRef.current!.state.x + 20,
          y: this.props.playerRef.current!.state.y,
          canvasHeight: this.props.canvasHeight,
        };
        return {
          bullets: [...prevState.bullets, bullet],
        };
      });
    }
  }

  update() {
    this.setState((prevState) => {
      let bullets = prevState.bullets;

      bullets.forEach((bullet) => {
        bullet.y += 10;
      });

      bullets = bullets.filter((bullet) => {
        return bullet.y < this.props.canvasHeight;
      });

      return { bullets };
    });
  }

  getBullets(): IBulletProps[] {
    return this.state.bullets || [];
  }

  setBullets(newBullets: IBulletProps[]): void {
    this.setState({ bullets: newBullets });
  }

  render() {
    return (
      <div>
        {this.state.bullets.map((bullet, index) => {
          return <Bullet key={index} {...bullet} />;
        })}
      </div>
    );
  }
}
