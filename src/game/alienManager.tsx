import React from "react";
import Alien, { IAlienProps } from "./alien";
import Player from "./player";
import BulletManager from "./bulletManager";
import IBulletProps from "./bullet";

interface IAlienManagerProps {
  canvasWidth: number;
  canvasHeight: number;
  playerRef: React.RefObject<Player>;
  bulletManagerRef: React.RefObject<BulletManager>;
}

interface IAlienManagerState {
  direction: number;
  aliens: IAlienProps[];
}

export default class AlienManager extends React.Component<
  IAlienManagerProps,
  IAlienManagerState
> {
  constructor(props: IAlienManagerProps) {
    super(props);
    this.state = {
      direction: 1,
      aliens: [],
    };
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.generateAliens();
  }

  generateAliens() {
    let aliens: IAlienProps[] = [];
    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 5; j++) {
        aliens.push({
          x: 10 + (i * 50 + 10),
          y: this.props.canvasHeight - 280 + (j * 50 + 10),
          hp: 100,
        });
      }
    }
    this.setState({ aliens: aliens });
  }

  moveAliens() {
    let aliens = this.state.aliens;
    let minX = 100000;
    let maxX = 0;

    aliens.forEach((alien) => {
      if (alien.x < minX) {
        minX = alien.x;
      }
      if (alien.x > maxX) {
        maxX = alien.x;
      }
    });

    let moveX = 0;
    let moveY = 0;
    if (minX > 0 && maxX < this.props.canvasWidth - 30) {
      moveX = this.state.direction;
    } else {
      moveX = this.state.direction * -1;
      moveY = -10;

      this.setState({ direction: this.state.direction * -1 });
    }

    aliens.forEach((alien) => {
      alien.x += moveX;
      alien.y += moveY;
    });

    this.setState({ aliens });
  }

  checkCollision() {
    let bullets = this.props.bulletManagerRef.current!.getBullets();
    let newBullets = bullets;
    let aliens = this.state.aliens;
    let newAliens: IAlienProps[] = [];

    aliens.forEach((alien) => {
      let collision = false;
      bullets.forEach((bullet) => {
        if (
          bullet.x >= alien.x &&
          bullet.x <= alien.x + 40 &&
          bullet.y >= alien.y &&
          bullet.y <= alien.y + 40
        ) {
          newBullets = newBullets.filter((b) => b !== bullet);
          alien.hp -= bullet.damage;
        }
      });
      if (alien.hp > 0) {
        newAliens.push(alien);
      }
    });
    this.setState({ aliens: newAliens });
    this.props.bulletManagerRef.current!.setBullets(newBullets);
  }

  update() {
    this.moveAliens();
    this.checkCollision();
  }

  render() {
    return (
      <div>
        {this.state.aliens.map((alien, index) => (
          <Alien key={index} {...alien} />
        ))}
      </div>
    );
  }
}
