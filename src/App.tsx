import Canvas from "./game/canvas";

function App() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden">
      <Canvas width={800} height={800} />
    </div>
  );
}

export default App;
