
canvasWidth = 640;
canvasHeight = 480;

// Matter.jsのAPIの読み込み
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint;

var engine = Engine.create();
 
// create a renderer
var render = Render.create({
      element: document.getElementById("canvas"), //Canvasを設置する要素を指定
      engine: engine, //生成したEngineを指定
      options: {
        width: canvasWidth, //CanvasのWidth
        height: canvasHeight, //CanvasのHeight
        pixelRatio: 2, //Pixel比; スマホ用に2にする
        background: "rgba(0, 0, 0, 0)", //背景色
        wireframes: false //ワイヤーフレームモードをOFFにする
      }
    });

var mousedrag = MouseConstraint.create(engine, {
  element: canvas.childNodes[0], //マウス操作を感知する要素を指定（DEMOでは生成したcanvasを指定）
  constraint: {
    render: {
      strokeStyle: "rgba(0, 0, 0, 0)" //マウス操作の表示を隠す
    }
  }
});
World.add(engine.world, mousedrag);

//四角の要素
var numOfObject = 5;
var bodies = [];
for(var i = 1; i <= numOfObject; i++) {
  var obj = Bodies.rectangle(
    Math.random() * (canvasWidth) + 0, // x位置
    Math.random() * (canvasHeight/2) + canvasHeight/2, // y位置
    64,
    64,
    { 
      label: 'box' + i,
      chamfer: 5,
      density: 0.2, // 密度
      frictionAir: 0.15, // 空気抵抗
      render: { //ボールのレンダリングの設定
				sprite: { //スプライトの設定
					texture: './images/' + i + '.png' //スプライトに使うテクスチャ画像を指定
				}
      },
    }
  );
  bodies.push(obj);
}

//外枠
bodies.push(Bodies.rectangle(0, 0, canvasWidth*2, 1, { isStatic: true }));
bodies.push(Bodies.rectangle(0, canvasHeight, canvasWidth*2, 1, { isStatic: true }));
bodies.push(Bodies.rectangle(0, 0, 1, canvasHeight*2, { isStatic: true }));
bodies.push(Bodies.rectangle(canvasWidth, 0, 1, canvasHeight*2, { isStatic: true }));
 
// add all of the bodies to the world
World.add(engine.world, bodies);

Events.on(mousedrag, "startdrag", function(e) {
  console.log(mousedrag.body);
  mousedrag.body.angle = 0;
  mousedrag.body.anglePrev = 0;
  mousedrag.body.angularSpeed = 0;
  mousedrag.body.angularVelocity = 0;
  //if(e.body.label == "ne") {
  //  console.log(e);
  //}
});

Engine.run(engine);
 
// run the renderer
Render.run(render);