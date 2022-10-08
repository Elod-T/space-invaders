import React from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { Keypoint } from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";

interface ITensorProps {
  fps: number;
}

interface ITensorState {
  poses: Keypoint[];
  renderLoop: ReturnType<typeof setInterval>;
  webcam: HTMLVideoElement | null;
  detector: poseDetection.PoseDetector | null;
  left: boolean;
  right: boolean;
  leftCount: number;
  rightCount: number;
}

export default class Tensor extends React.PureComponent<
  ITensorProps,
  ITensorState
> {
  constructor(props: ITensorProps) {
    super(props);
    this.state = {
      poses: [],
      renderLoop: setInterval(() => {}, 0),
      webcam: null,
      detector: null,
      left: false,
      right: false,
      leftCount: 0,
      rightCount: 0,
    };

    this.update = this.update.bind(this);
  }

  async componentDidMount() {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      maxPoses: 1,
      type: "lightning",
    };
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    const webcam = document.getElementById("webcam") as HTMLVideoElement;

    this.setState({
      webcam,
      detector,
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.renderLoop);
  }

  async update() {
    if (!this.state.detector || !this.state.webcam) return;

    let data = await this.state.detector.estimatePoses(this.state.webcam);

    if (!data || !data[0] || !data[0].keypoints) return;
    let poses = data[0].keypoints;

    const posesToRender = poses.filter(
      (pose) =>
        !(pose.name?.includes("ear") || pose.name?.includes("eye")) &&
        (pose.score || 0) > 0.5
    );

    poses = poses.filter(
      (pose) =>
        (pose.name?.includes("wrist") || pose.name?.includes("elbow")) &&
        (pose.score || 0) > 0.5
    );

    if (poses.length == 4) {
      this.setState({
        poses: posesToRender,
        left: poses[0].y > poses[2].y,
        right: poses[1].y > poses[3].y,
        leftCount: poses[0].y > poses[2].y ? this.state.leftCount + 1 : 0,
        rightCount: poses[1].y > poses[3].y ? this.state.rightCount + 1 : 0,
      });
    }
  }

  render() {
    return (
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: "scale(-1, 1)",
        }}
      >
        <Webcam id="webcam" className="invisible" width={640} height={480} />
        {this.state.poses.map((pose, index) => (
          <div
            key={index}
            id={pose.name}
            className="absolute bg-red-500 rounded-full w-4 h-4 z-0"
            style={{
              top: pose.y,
              left: pose.x,
              opacity: pose.score,
            }}
          ></div>
        ))}
      </div>
    );
  }
}
