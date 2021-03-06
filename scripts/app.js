(function(){
  'use strict';
    
  const canvasWidth = window.innerWidth * 0.95 - 10,
      canvasHeight = window.innerHeight * 0.95 - 90, // キャンバス高さ
      numOfBox = Math.round(Math.random() * 7) + 3, // boxの数。3～10でランダム
      boxHeight = 64; // boxデフォルトサイズ(scale = 1)

  // boxの数の+1個が収まるスケールにする
  const scale = canvasHeight / (boxHeight * (numOfBox + 1)),
      boxRealSize = boxHeight*scale;

  // Matter.jsのAPIの読み込み
  const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Events = Matter.Events,
      MouseConstraint = Matter.MouseConstraint;

  const engine = Engine.create();

  engine.world.gravity.y = 0.5;

  const render = Render.create({
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

      const mousedrag = MouseConstraint.create(engine, {
    element: canvas.childNodes[0], //マウス操作を感知する要素
    constraint: {
      render: {
        strokeStyle: "rgba(0, 0, 0, 0)" //マウス操作の表示を隠す
      }
    }
  });
  World.add(engine.world, mousedrag);

  // 四角の要素
  const boxes = [];
  for (let i = 1; i <= numOfBox; i++) {
    let obj = Bodies.rectangle(
      Math.random() * canvasWidth, // x位置
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
            texture: './images/tex/' + i + '.png', // テクスチャ画像
            xScale: scale,
            yScale: scale
          }
        },
      }
    );
    boxes.push(obj);
  }

  World.add(engine.world, boxes);

  // 外枠
  const borders = [];
  borders.push(Bodies.rectangle(0, 0, canvasWidth*2, 1, { isStatic: true }));
  borders.push(Bodies.rectangle(0, canvasHeight, canvasWidth*2, 1, { isStatic: true }));
  borders.push(Bodies.rectangle(0, 0, 1, canvasHeight*2, { isStatic: true }));
  borders.push(Bodies.rectangle(canvasWidth, 0, 1, canvasHeight*2, { isStatic: true }));
  World.add(engine.world, borders);

  Events.on(mousedrag, "startdrag", function(e) {
    console.log("startdrag", mousedrag.body.angle);
    if (!mousedrag.body.isStatic) {
      Body.rotate( mousedrag.body, Math.PI*2 - mousedrag.body.angle);
    }
  });
  Events.on(mousedrag, "enddrag", function(e) {
    console.log("enddrag");
  });

  Engine.run(engine);
  
  Render.run(render);


  const btnCheck = document.getElementById("btnCheck");
  btnCheck.addEventListener('click', function() {
    let isClear = true;
    for (var i = 0 ;  i < boxes.length-1 ; i++) {
      // NGなケース：次のboxの位置関係で判定
      if (boxes[i].position.y < boxes[i+1].position.y + boxRealSize*0.9) {
        toast.warn(boxes[i].label + 'のうえに' + boxes[i+1].label + 'をのせよう');
        isClear = false;
        break;
      }
    }
    if (isClear) {
      btnCheck.style.display = 'none';
      toast.setOption(15000, 'top');
      toast.success('すごーい！ やったね！');

      completeAnim();
    }
  }, false);

  const btnReload = document.getElementById("btnReload");
  btnReload.addEventListener('click', function() {
    window.location.reload();
  }, false);

  function completeAnim(fx, tx, fy, ty) {
    
    for (let i = 0 ;  i < boxes.length ; i++) {
      boxes[i].isStatic = true;
    }

    const getCubePos = function() {
      let p = {x: Math.random() * canvasWidth,
              y: Math.random() * canvasHeight - 50};
      if (fx < p.x && tx > p.x && fy < p.y && ty > p.y) {
        p = getCubePos(fx, tx, fy, ty);
      }
      return p;
    }
    var objs = [],
        fx = boxes[0].position.x-boxRealSize*0.5 - 5,
        tx = boxes[0].position.x+boxRealSize*0.5 + 5,
        fy = canvasHeight - boxRealSize*numOfBox - 5,
        ty = canvasHeight;
    for (let i = 1; i <= 200; i++) {
      let p = getCubePos(fx, tx, fy, ty);
      let obj = Bodies.rectangle(
        p.x, p.y, 15, 15,
        { 
          chamfer: 0, //角丸
          density: 3, // 密度
          restitution: 0.5, //反発
          frictionAir: 0.1, // 空気抵抗
          friction: 1, // 摩擦
        }
      );
      objs.push(obj);
    }
    World.add(engine.world, objs);
  }

  const toast = new aToast();
  toast.setOption(5000, 'top');
  toast.success('したから ちいさいじゅんに つんでみよう');

})();