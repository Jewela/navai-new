import * as PIXI from "pixi.js";

// Create the application
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});
document.body.appendChild(app.view);

// Helper function to create text elements
function createText(text, x, y, style) {
  const message = new PIXI.Text(text, style);
  message.x = x;
  message.y = y;
  app.stage.addChild(message);
  return message;
}

// Helper function to draw lines
function drawLine(x1, y1, x2, y2) {
  const line = new PIXI.Graphics();
  line.lineStyle(2, 0x000000, 1);
  line.moveTo(x1, y1);
  line.lineTo(x2, y2);
  app.stage.addChild(line);
}

// Define text style
const textStyle = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 16,
  fill: "white",
});

// Create the central node
const centralNode = createText(
  "List",
  app.renderer.width / 2,
  app.renderer.height / 2,
  textStyle
);

// Define the nodes and their positions
const nodes = [
  { text: "Clerical Celibacy", x: 300, y: 100 },
  { text: "Veneration of Relics", x: 500, y: 100 },
  { text: "Clerical Attire", x: 300, y: 300 },
  { text: "Holy Water", x: 500, y: 300 },
  { text: "Gestures of Prayer", x: 300, y: 500 },
  { text: "Forgiveness of Sins", x: 500, y: 500 },
  { text: "Sign of the Cross", x: 300, y: 700 },
  { text: "Papal Authority", x: 500, y: 700 },
  { text: "Asceticism and Fasting", x: 700, y: 100 },
  { text: "Iconostasis", x: 700, y: 300 },
  { text: "Icons", x: 700, y: 500 },
  { text: "Involvement of Children", x: 700, y: 700 },
];

// Create and connect nodes
nodes.forEach((node) => {
  const textNode = createText(node.text, node.x, node.y, textStyle);
  drawLine(
    centralNode.x + centralNode.width / 2,
    centralNode.y + centralNode.height / 2,
    node.x,
    node.y
  );
});
