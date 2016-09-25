//旧サイズ
//var COLS = 10, ROWS = 20;  // 横10、縦20マス
//新サイズ
var COLS = 16, ROWS = 12;  // 横10、縦20マス
var board = [];  // 盤面情報
var lose;  // 一番上までいっちゃったかどうか
var interval;  // ゲームを実行するタイマーを保持する変数
var current; // 今操作しているブロックの形
var currentX, currentY; // 今操作しているブロックの位置

var progress = 0;
var tickFlg = 0;

// 操作するブロックのパターン
// var shapes = [
//     [ 1, 1, 1, 1 ],
//     [ 1, 1, 1, 0,
//       1 ],
//     [ 1, 1, 1, 0,
//       0, 0, 1 ],
//     [ 1, 1, 0, 0,
//       1, 1 ],
//     [ 1, 1, 0, 0,
//       0, 1, 1 ],
//     [ 0, 1, 1, 0,
//       1, 1 ],
//     [ 0, 1, 0, 0,
//       1, 1, 1 ]
// ];

var shapes = [
  //縦10横1
  [1, 0, 0, 0, 1,0,0,0, 1,0,0,0, 1,0,0,0 ,1,0,0,0, 1,0,0,0, 1,0,0,0,
  1,0,0,0, 1,0,0,0, 1,0,0,0 ],
  //縦9横1
  [1, 0, 0, 0, 1,0,0,0, 1,0,0,0, 1,0,0,0 ,1,0,0,0, 1,0,0,0, 1,0,0,0,
  1,0,0,0, 1,0,0,0],
  //縦8横1
  [1, 0, 0, 0, 1,0,0,0, 1,0,0,0, 1,0,0,0 ,1,0,0,0, 1,0,0,0, 1,0,0,0,
  1,0,0,0],
  //縦7横1
  [1, 0, 0, 0, 1,0,0,0, 1,0,0,0, 1,0,0,0 ,1,0,0,0, 1,0,0,0, 1,0,0,0],
  //縦6横1
  [1, 0, 0, 0, 1,0,0,0, 1,0,0,0, 1,0,0,0 ,1,0,0,0, 1,0,0,0],
  //縦5横4
  [1, 1, 1, 1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
  //縦4横1
  [1, 0, 0, 0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
  //縦12横2
  [1, 1, 0, 0, 1,1,0,0, 1,1,0,0, 1,1,0,0 ,1,1,0,0, 1,1,0,0, 1,1,0,0,
  1,1,0,0, 1,1,0,0, 1,1,0,0, 1,1,0,0, 1,1,0,0],
  //縦2横3
  [1, 1, 1, 0, 1,1,1,0],
  //縦1横1
  [1,0]
];

// ブロックの色
var colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

// 盤面を空にする
function init() {
  for ( var y = 0; y < ROWS; ++y ) {
    board[ y ] = [];
    for ( var x = 0; x < COLS; ++x ) {
      board[ y ][ x ] = 0;
    }
  }
}


// shapesからランダムにブロックのパターンを出力し、盤面の一番上へセットする
function newShape() {
  // var id = Math.floor( Math.random() * shapes.length );  // ランダムにインデックスを出す
  var id = progress;
  var shape = shapes[ id ];
  var currentHeight = (shapes[id].length) / 4;
  // パターンを操作ブロックへセットする
  current = [];
  for ( var y = 0; y < currentHeight; ++y ) {
    current[ y ] = [];
    for ( var x = 0; x < 4; ++x ) {
      var i = 4 * y + x;
      if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
        current[ y ][ x ] = id + 1;
      }
      else {
        current[ y ][ x ] = 0;
      }
    }
  }
  // ブロックを盤面の上のほうにセットする
  if(id === 6 || id === 7){
    currentX = progress + 3;
  }
  else if(id === 8){
    currentX = progress + 4;
  }
  else if(id === 9){
    currentX = progress + 6;
  }
  else{
    currentX = progress;
  }
  currentY = 0;
}

function tick() {
  // １つ下へ移動する
  if ( valid( 0, 1 ) && tickFlg === 0 ) {
    ++currentY;
  }
  // もし着地していたら(１つしたにブロックがあったら)
  // else {
  //   freeze();  // 操作ブロックを盤面へ固定する
  //   clearLines();  // ライン消去処理
  //   if (lose) {
  //     // もしゲームオーバなら最初から始める
  //     newGame();
  //     return false;
  //   }
  //   // 新しい操作ブロックをセットする
  //   newShape();
  // }
  else if(currentY === 0){
    tickFlg = 0;
  }

  else {
    --currentY;
    tickFlg = 1;
  }
}

// 指定された方向に、操作ブロックを動かせるかどうかチェックする
// ゲームオーバー判定もここで行う
function valid( offsetX, offsetY, newCurrent ) {
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || current;
  var currentHeight = (shapes[progress].length) / 4;
  for ( var y = 0; y < currentHeight; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( newCurrent[ y ][ x ] ) {
        if ( typeof board[ y + offsetY ] == 'undefined'
             || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
             || board[ y + offsetY ][ x + offsetX ]
             || x + offsetX < 0
             || y + offsetY >= ROWS
             || x + offsetX >= COLS ) {
                    if (offsetY == 1 && offsetX - currentX == 0 && offsetY - currentY == 1) {
                        console.log('game over');
                        lose = true; // もし操作ブロックが盤面の上にあったらゲームオーバーにする
                    }
               return false;
             }
      }
    }
  }
  return true;
}


// 操作ブロックを盤面にセットする関数
function freeze() {
  var currentHeight = (shapes[progress].length) / 4;
  for ( var y = 0; y < currentHeight; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( current[ y ][ x ] ) {
        board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
      }
    }
  }
}

// 一行が揃っているか調べ、揃っていたらそれらを消す
function clearLines() {
  for ( var y = ROWS - 1; y >= 0; --y ) {
    var rowFilled = true;
    // 一行が揃っているか調べる
    for ( var x = 0; x < COLS; ++x ) {
      if ( board[ y ][ x ] == 0 ) {
        rowFilled = false;
        break;
      }
    }
    // もし一行揃っていたら, サウンドを鳴らしてそれらを消す。
    if ( rowFilled ) {
      document.getElementById( 'clearsound' ).play();  // 消滅サウンドを鳴らす
      // その上にあったブロックを一つずつ落としていく
      for ( var yy = y; yy > 0; --yy ) {
        for ( var x = 0; x < COLS; ++x ) {
          board[ yy ][ x ] = board[ yy - 1 ][ x ];
        }
      }
      ++y;  // 一行落としたのでチェック処理を一つ下へ送る
    }
  }
}


//initialize
function newGame() {
  clearInterval(interval);  // ゲームタイマーをクリア
  init();  // 盤面をまっさらにする
  newShape();  // 操作ブロックをセット
  lose = false;  // 負けフラッグ
  interval = setInterval( tick, 250 );  // 250ミリ秒ごとにtickという関数を呼び出す
}

newGame();
