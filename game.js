kaboom({
  global: true,
  scale: 2,

  fullscreen: true,

  clearColor: [0, 1, 0.6, 1],
});

loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("check_point", "block_blue.png");
loadSprite("mario", "mario.png");
loadSprite("coin", "coin.png");
loadSprite("evil", "evil_mushroom.png");
loadSprite("z", "z.png");
loadSprite("sur", "surprise.png");
loadSprite("surP", "surprise.png");
loadSound("jump", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");
loadSprite("loop", "loop.png");
loadSprite("dino", "dino.png");
loadSprite("star", "star.png");
loadSprite("princes", "princes.png");
loadSprite("spong", "spongebob.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("potato", "potato.png");
loadSprite("health", "heart.png");

let score = 0;
let heart = 3;

scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                            =             ",
    "                                            =           ",
    "                                 = =  =        =          ",
    "                           =====     = = = =     ==                ",
    "                              $ =      =     ==                    ",
    "                         =$==  $     =     =     ==                    ",
    "                           ==$== $    =  =  =  =                           ",
    "                               $                 $    ",
    "                                              $===$            ",
    "                                   $   $     $==== $  $                    ",
    "                               $           $                          ",
    " =            !       @         $      ===            $                                                                  p           ",
    "|   =               M         $            ==      M     $s                 @     @                                             ",
    "========c======================== == === = ========= == ======== == ======================================================== ",
  ];
  let check_point_pos_x = 0;

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    "|": [sprite("block"), solid(), "wall"],
    M: [sprite("mario"), solid(), "mario", body()],
    "!": [sprite("sur"), solid(), "sur"],
    L: [sprite("loop"), solid(), "loop"],
    "#": [sprite("surP"), solid(), "surP"],
    $: [sprite("coin"), "coin"],
    d: [sprite("dino"), solid(), "dino", body()],
    s: [sprite("star"), solid(), "star", body()],
    "@": [sprite("spong"), solid(), "spong", body()],
    p: [sprite("pipe"), solid(), "pipe", body()],
    c: [sprite("check_point"), solid(), "check_point"],
  };
  const gameLevel = addLevel(map, mapSymbols);
  const player = add([
    sprite("evil"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    "evil",
    big(),
  ]);
  const scoreLabel = add([text("score:0")]);
  const heartobj = add([
    sprite("health"),
    text("    x3", 12),
    origin("center"),
  ]);
  const evil = add([
    sprite("evil"),
    solid(),
    pos(500, 0),
    body(),
    origin("bot"),
  ]);

  keyDown("right", () => {
    player.move(130, 0);
  });
  keyDown("left", () => {
    player.move(-130, 0);
  });
  keyDown("up", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(CURRENT_JUMP_FORCE);
    }
  });
  keyDown("left", () => {
    if (evil.moven) {
      evil.move(-130, 0);
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("surP")) {
      destroy(obj);
      gameLevel.spawn("L", obj.gridPos);
      gameLevel.spawn("s", obj.gridPos.sub(0, 1));
    }
  });
  player.on("headbump", (obj) => {
    if (obj.is("sur")) {
      destroy(obj);
      gameLevel.spawn("L", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
  });
  evil.on("headbump", (obj) => {
    if (obj.is("z")) {
      destroy(obj);
    }
  });

  let mario_move = -30;
  let spong_move = -30;

  action("mario", (obj) => {
    obj.move(mario_move, 0);
  });
  collides("mario", "wall", () => {
    mario_move = -mario_move;
  });
  action("spong", (obj) => {
    obj.move(spong_move, 0);
  });
  collides("spong", "wall", () => {
    spong_move = -spong_move;
  });
  action("dino", (obj) => {
    obj.move(20, 0);
  });
  player.collides("coin", (obj) => {
    destroy(obj);
    score++;
  });

  player.collides("check_point", (obj) => {
    check_point_pos_x = player.pos.x;
  });

  player.collides("star", (obj) => {
    destroy(obj);
    player.biggify(10);
  });
  action("star", (obj) => {
    obj.move(20, 0);
  });
  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    heartobj.pos = player.pos.sub(400, 160);
    scoreLabel.text = "score:" + score;
    heartobj.text = "   x" + heart;
    if (player.pos.y > 600) {
      heart--;
      player.pos.x = check_point_pos_x;
      player.pos.y = 220;
    }
    if (heart <= 0) {
      go("lose");
    }
  });
  action("mario", (obj) => {
    obj.move(-20, 0);
  });
  action("spong", (obj) => {
    obj.move(-20, 0);
  });
  let lastgrounded = true;
  player.collides("mario", (obj) => {
    if (lastgrounded) {
      heart--;
      player.pos.x = check_point_pos_x;
      player.pos.y = 220;
    } else {
      destroy(obj);
    }
  });
  player.collides("mario", (obj) => {
    if (lastgrounded) {
      heart--;
      player.pos.x = check_point_pos_x;
      player.pos.y = 220;
    } else {
      destroy(obj);
    }
  });
  player.collides("spong", (obj) => {
    if (lastgrounded) {
      heart--;
      player.pos.x = check_point_pos_x;
      player.pos.y = 220;
    } else {
      destroy(obj);
    }
  });

  player.action(() => {
    lastgrounded = player.grounded();
  });
  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("game2");
    });
  });
});

scene("game2", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                            =             ",
    "                                            =           ",
    "                                 = =  =        =          ",
    "                           =====     = = = =     ==                ",
    "                              $ =      =     ==                    ",
    "                         =$==  $     =     =     ==                    ",
    "         =                  ==$== $    =  =  =  =                           ",
    "         =                      $              ==   $    ",
    "         =                                     $===$            ",
    "         =                          $   $   ==  $==== $  $                    ",
    "         =                      $        ==   $                          ",
    "         =    !t@         $    ==  ===            $                                                              p        ",
    " =               t         $        ==    ==      t     $s             ===          t                  t                          ",
    "======c======================== == === = ========= == ======== == ======================================================== ",
  ];

  let check_point_pos_x = 0;

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    "|": [sprite("block"), solid(), "wall"],
    M: [sprite("mario"), solid(), "mario", body()],
    "!": [sprite("sur"), solid(), "sur"],
    L: [sprite("loop"), solid(), "loop"],
    "#": [sprite("surP"), solid(), "surP"],
    $: [sprite("coin"), "coin"],
    d: [sprite("dino"), solid(), "dino", body()],
    s: [sprite("star"), solid(), "star", body()],
    "@": [sprite("spong"), solid(), "spong", body()],
    p: [sprite("pipe"), solid(), "pipe", body()],
    t: [sprite("potato"), solid(), "potato", body()],
    c: [sprite("check_point"), solid(), "check_point"],
  };
  const gameLevel = addLevel(map, mapSymbols);
  const player = add([
    sprite("evil"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    "evil",
    big(),
  ]);
  const scoreLabel = add([text("score:0")]);
  const evil = add([
    sprite("evil"),
    solid(),
    pos(500, 0),
    body(),
    origin("bot"),
  ]);

  keyDown("right", () => {
    player.move(130, 0);
  });
  keyDown("left", () => {
    player.move(-130, 0);
  });
  keyDown("up", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(CURRENT_JUMP_FORCE);
    }
  });
  keyDown("left", () => {
    if (evil.moven) {
      evil.move(-130, 0);
    }
  });

  player.collides("check_point", (obj) => {
    check_point_pos_x = player.pos.x;
  });

  player.on("headbump", (obj) => {
    if (obj.is("surP")) {
      destroy(obj);
      gameLevel.spawn("L", obj.gridPos);
      gameLevel.spawn("s", obj.gridPos.sub(0, 1));
    }
  });
  player.on("headbump", (obj) => {
    if (obj.is("sur")) {
      destroy(obj);
      gameLevel.spawn("L", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
  });
  evil.on("headbump", (obj) => {
    if (obj.is("z")) {
      destroy(obj);
    }
  });

  let mario_move = -30;
  let spong_move = -30;
  let potato_move = -30;

  action("mario", (obj) => {
    obj.move(mario_move, 0);
  });
  collides("mario", "wall", () => {
    mario_move = -mario_move;
  });
  action("potato", (obj) => {
    obj.move(mario_move, 0);
  });
  collides("potato", "wall", () => {
    mario_move = -mario_move;
  });
  action("spong", (obj) => {
    obj.move(spong_move, 0);
  });
  collides("spong", "wall", () => {
    spong_move = -spong_move;
  });
  action("dino", (obj) => {
    obj.move(20, 0);
  });
  player.collides("coin", (obj) => {
    destroy(obj);
    score++;
  });
  player.collides("star", (obj) => {
    destroy(obj);
    player.biggify(10);
  });
  action("star", (obj) => {
    obj.move(20, 0);
  });
  player.action(() => {
    camPos(player.pos);
    console.log(player.pos.y);
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "score:" + score;
    if (player.pos.y > 600) {
      heart--;
      player.pos.x = check_point_pos_x;
      player.pos.y = 180;
    }
  });
  action("mario", (obj) => {
    obj.move(-20, 0);
  });
  action("spong", (obj) => {
    obj.move(-20, 0);
  });
  let lastgrounded = true;
  player.collides("mario", (obj) => {
    if (lastgrounded) {
      destroy(player);
      go("lose");
    } else {
      destroy(obj);
    }
  });
  player.collides("potato", (obj) => {
    if (lastgrounded) {
      heart--;
      player.pos.x = check_point_pos_x;
      player.pos.y = 180;
    } else {
      destroy(obj);
    }
  });
  player.collides("mario", (obj) => {
    if (lastgrounded) {
      destroy(player);
      go("lose");
    } else {
      destroy(obj);
    }
  });
  player.collides("spong", (obj) => {
    if (lastgrounded) {
      heart--;
      player.pos.x = check_point_pos_x;
      player.pos.y = 180;
    } else {
      destroy(obj);
    }
  });

  player.action(() => {
    lastgrounded = player.grounded();
  });
  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("win");
    });
  });
});
scene("lose", () => {
  heart = 3;
  hearts = 3;
  score = 0;
  add([rect(width(), height()), color(0, 0, 0)]);

  add([
    text("GAME OVER \n u lost", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  keyDown("space", () => {
    go("game");
  });
});
scene("win", () => {
  add([
    text("U WIN \n ;)", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

start("game");
