
var canvasWidth = window.innerWidth*0.9 - 20,
    canvasHeight = window.innerHeight*0.9 - 120, // キャンバス高さ
    numOfObject = Math.round(Math.random() * 7) + 3, // boxの数。3～10でランダム
    boxHeight = 64; // boxデフォルトサイズ(scale = 1)
console.log(canvasHeight, numOfObject)
// boxの数の+1個が収まるスケールにする
var scale = canvasHeight / (boxHeight * (numOfObject + 1));

// Matter.jsのAPIの読み込み
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
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
var boxes = [];
for(var i = 1; i <= numOfObject; i++) {
  var obj = Bodies.rectangle(
    Math.random() * (canvasWidth) + 0, // x位置
    Math.random() * (canvasHeight/3) + canvasHeight/3*2, // y位置
    64*scale,
    64*scale,
    { 
      label: (i+'').replace(/[A-Za-z0-9]/g, function(s) {
          return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
      }),
      chamfer: 0, //角丸
      density: 1, // 密度
      restitution: 0, //反発
      frictionAir: 0.2, // 空気抵抗
      friction: 1, // 摩擦
      render: { //ボールのレンダリングの設定
				sprite: { //スプライトの設定
          texture: './images/tex/' + i + '.png', //スプライトに使うテクスチャ画像を指定
          xScale: scale,
          yScale: scale
				}
      },
    }
  );
  boxes.push(obj);
}
engine.world.gravity.y = 0.5;

World.add(engine.world, boxes);

var borders = [];
//外枠
borders.push(Bodies.rectangle(0, 0, canvasWidth*2, 1, { isStatic: true }));
borders.push(Bodies.rectangle(0, canvasHeight, canvasWidth*2, 1, { isStatic: true }));
borders.push(Bodies.rectangle(0, 0, 1, canvasHeight*2, { isStatic: true }));
borders.push(Bodies.rectangle(canvasWidth, 0, 1, canvasHeight*2, { isStatic: true }));
 
// add all of the bodies to the world
World.add(engine.world, borders);

Events.on(mousedrag, "startdrag", function(e) {
  //console.log("startdrag", mousedrag.body);
  console.log("startdrag", mousedrag.body.angle);
  Body.rotate( mousedrag.body, Math.PI*2 - mousedrag.body.angle);
  //if(e.body.label == "ne") {
  //  console.log(e);
  //}
});
Events.on(mousedrag, "enddrag", function(e) {
  console.log("enddrag");
});


Engine.run(engine);
 
// run the renderer
Render.run(render);


var btnReload = document.getElementById("btnCheck");
btnReload.addEventListener('click', function() {
  var isClear = true;
  for (var i = 0 ;  i < boxes.length-1 ; i++) {
    console.log(boxes[i].label, boxes[i].position.y, boxes[i+1].position.y)
    // NGなケース：次のboxの位置関係で判定
    if (boxes[i].position.y < boxes[i+1].position.y + boxHeight*scale*0.9) {
      antoast.warn(boxes[i+1].label + 'を、' + boxes[i].label + 'の　うえにのせよう');
      isClear = false;
      break;
    }
  }
  if (isClear) {
    antoast.success('すごーい！　やったね！');
  }
}, false);

var btnReload = document.getElementById("btnReload");
btnReload.addEventListener('click', function() {
  window.location.reload();
}, false);


var antoast = new anToast();
antoast.setOption(5000, 'top');
antoast.success('したから　ちいさいじゅんにつんでいこう');