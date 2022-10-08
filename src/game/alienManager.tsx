import React from "react";
import Alien, { IAlienProps } from "./alien";
import Player from "./player";
import BulletManager from "./bulletManager";

interface IAlienManagerProps {
  canvasWidth: number;
  canvasHeight: number;
  playerRef: React.RefObject<Player>;
  bulletManagerRef: React.RefObject<BulletManager>;
  volume: number;
}

interface IAlienManagerState {
  direction: number;
  aliens: IAlienProps[];
  alienDieAudio: HTMLAudioElement;
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
      alienDieAudio: new Audio("/audio/invaderkilled.wav"),
    };
    this.update = this.update.bind(this);
    this.getLowestY = this.getLowestY.bind(this);
  }

  componentDidMount() {
    this.generateAliens();
    this.state.alienDieAudio.volume = this.props.volume;
  }

  generateAliens() {
    let aliens: IAlienProps[] = [];
    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 5; j++) {
        aliens.push({
          x: this.props.canvasWidth / 6 + (i * 50 + 10),
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
    let minY = 100000;

    aliens.forEach((alien) => {
      if (alien.x < minX) {
        minX = alien.x;
      }
      if (alien.x > maxX) {
        maxX = alien.x;
      }
      if (alien.y < minY) {
        minY = alien.y;
      }
    });

    let moveX = 0;
    let moveY = 0;
    if (minX > 0 && maxX < this.props.canvasWidth - 30) {
      moveX = this.state.direction;
    } else {
      moveX = this.state.direction * -1;
      moveY = -20;

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
      bullets.forEach((bullet) => {
        if (
          bullet.x + 10 >= alien.x &&
          bullet.x + 10 <= alien.x + 40 &&
          bullet.y >= alien.y &&
          bullet.y <= alien.y + 40
        ) {
          newBullets = newBullets.filter((b) => b !== bullet);
          alien.hp -= bullet.damage;
          if (alien.hp <= 0) {
            this.state.alienDieAudio.play();
          }
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

  getLowestY(): number {
    let lowestY = 100000;
    this.state.aliens.forEach((alien) => {
      if (alien.y < lowestY) {
        lowestY = alien.y;
      }
    });
    return lowestY;
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
