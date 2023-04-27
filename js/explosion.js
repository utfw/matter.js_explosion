var Engine = Matter.Engine,
  World = Matter.World,
  Composites = Matter.Composites,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies;
  Body = Matter.Body;
  Events = Matter.Events;
  Mouse = Matter.Mouse;
  MouseConstraint = Matter.MouseConstraint;
  Render = Matter.Render;

const boxWidth = 40;
const boxHeight = 40; 
var engine = Engine.create();
engine.world.gravity.y = 0;
var stackA = Composites.stack(0, 0, Math.ceil(window.innerWidth / boxWidth), Math.ceil(window.innerHeight / boxHeight), 0, 0, function(x, y) {
  return Bodies.rectangle(x, y, boxWidth, boxHeight, {
    render: {
      fillStyle: "#333",
      strokeStyle: "#000", 
    }
  });
});

World.add(engine.world, [stackA]);

var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false, // 테두리 여부
    background: 'white'
  },
  // SVG 요소 생성
  createSVGElement: function(tagName, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
    return el;
  }
});
// 렌더러 객체에 SVG 요소 대상으로 설정
render.svg = true;
// 엔진 객체 업데이트하고 렌더링
Engine.run(engine);
Render.run(render);

var mouse = Mouse.create(render.canvas),
mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
  }
});

Events.on(mouseConstraint, 'mousedown', function(e) {
  console.log(mouseConstraint.body); //눌린 대상
  engine.world.gravity.y = 1.2;
  var clickedBody = mouseConstraint.body;
  var x = clickedBody.position.x;
  var y = clickedBody.position.y;
  setExplosion(x,y);
  Events.off(mouseConstraint, 'mousedown'); // 해당 요소의 'mousedown'이벤트를 제거함. 
});

function setExplosion(x,y){
  for (var i = 0; i < stackA.bodies.length; i++) {
    var body = stackA.bodies[i];
    var randomNum = Math.random();
    const xForce = 24;
    const yForce = 5;
    var xDiff = x - stackA.bodies[i].position.x;
    var yDiff = y - stackA.bodies[i].position.y;
    
    var xDir = (xDiff < -1) ? randomNum / xForce : -randomNum / xForce;
    var yDir = (yDiff < -1) ? randomNum / yForce : -randomNum / yForce;
    Body.applyForce(body, {x: body.position.x, y: body.position.y}, {x: xDir, y: yDir});

    const distance = Math.sqrt(xDiff*xDiff + yDiff*yDiff);
    const brightness = 120/distance;
    body.render.fillStyle = `rgba(33, 33, 33, ${brightness})`;
  }
}