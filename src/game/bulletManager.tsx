import React from "react";
import { v4 as uuidv4 } from "uuid";
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
          id: uuidv4(),
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
    let bullets = this.state.bullets;
    let newBullets = bullets;

    newBullets = bullets.filter((bullet) => {
      return bullet.y < this.props.canvasHeight;
    });

    newBullets.forEach((bullet) => {
      bullet.y += 10;
    });

    bullets.forEach((bullet) => {
      if (!newBullets.includes(bullet)) {
        this.removeBullet(bullet.id);
      }
    });

    this.setBullets(newBullets);
  }

  getBullets(): IBulletProps[] {
    return this.state.bullets || [];
  }

  setBullets(newBullets: IBulletProps[]): void {
    this.setState({ bullets: newBullets });
  }

  removeBullet(id: ReturnType<typeof uuidv4>) {
    const bullet = document.getElementById(id);
    if (bullet) {
      bullet.parentNode!.removeChild(bullet);
    }
  }

  render() {
    return (
      <div>
        {this.state.bullets.map((bullet) => {
          return <Bullet key={bullet.id} {...bullet} />;
        })}
      </div>
    );
  }
}
