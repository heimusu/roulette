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
var minusFlg = 0;


//盤面上の成否判定エリア
var safeTop = 0;
var safeBottom = ROWS;

//速度ロジック
var speed = 110;
var breakFlg = 0;


//画像
var src = "./img/ace.jpg";
var img = new Image();
img.src = src;

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

var blockHeight = [10, 9, 8, 7, 6, 5, 4, 12, 2, 1];
var blockWidth = [1, 1, 1, 1, 1, 4, 1, 2, 3, 1];

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
  console.log(current);

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

//画面の更新・ブロックの動きを司る関数
function tick() {
  //現在の高さ
  var currentHeight = (shapes[progress].length) / 4;

  //エスケープ処理
  if(currentHeight <= 1){
    currentHeight = 1;
  }


  //ブロックを下向きに動かす
  if(tickFlg === 0 && currentY < 11){
    currentY++;
    //SEを鳴らす
    if(currentY === 11){
      se1();
    }
  }

  //ブロックを上向きに動かす
  else if(currentY < 0){
    if(currentY <= 0 && minusFlg === 0){
      --currentY;
      //エスケープ処理
      if(currentY === -currentHeight){
        se1();
        minusFlg = 1;
      }
    }

    //上限に達したらブロックの進行方向を下向きにする
    else if(currentY <= 0 && minusFlg === 1){
      currentY++;
      if(currentY === 0){
        minusFlg = 0;
        tickFlg = 0;
        return false;
      }
    }
  }

  //ブロックを上向きに動かす
  else {
    --currentY;
    tickFlg = 1;
  }
}

// 指定された方向に、操作ブロックを動かせるかどうかチェックする
// ゲームオーバー判定もここで行う
function valid( offsetX, offsetY, newCurrent ) {
  // console.log(offsetY);
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || current;
  var currentHeight = (shapes[progress].length) / 4;
  // console.log(currentHeight);
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
// function freeze() {
//   var currentHeight = (shapes[progress].length) / 4;
//   for ( var y = 0; y < currentHeight; ++y ) {
//     for ( var x = 0; x < 4; ++x ) {
//       console.log(current[y][x]);
//       if ( current[ y ][ x ]) {
//         board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
//       }
//     }
//   }
// }

function freeze(){
  // console.log(currentY);
  //現在のブロックのパラメータ
  var currentBlockHeight = blockHeight[progress];
  var currentBlockWidth = blockWidth[progress];



  //ブロックの描画
  for(var y = 0; y < currentBlockHeight; y++){
    for(var x = 0; x < currentBlockWidth; x++){
      if((y + currentY) >= ROWS){
        return false;
      }
      else if(currentY < 0){
        if(y < (currentBlockHeight + currentY) )
        board[y][x + currentX] = 1;
      }
      else{
        board[y + currentY][x + currentX] = 1;
      }
    }
  }
}

function check(){
  var currentBlockHeight = blockHeight[progress];
  //セーフなエリアのTOP
  // console.log(currentY);
  var currentTop = currentY;
  //セーフなエリアのBOTTOM
  // console.log(currentY + currentBlockHeight);
  var currentBottom = currentY + currentBlockHeight;

  //大小判定
  if(currentTop < 0){
    currentTop = 0;
  }

  if(currentBottom >= ROWS){
    currentBottom >= ROWS;
  }


  // 成否判定
  // 最初の一回は判定外
  if(progress === 0){
    safeTop = currentTop;
    safeBottom = currentBottom;
  }

  // else if(progress === 9){
  //   clear();
  // }

  //2ブロック目以降
  else{
    //セーフな高さと低さを設定
    var safeArea = safeBottom - safeTop;
    var currentArea = currentBottom - currentTop;

    //低まったらゲームオーバー
    if(currentTop > safeBottom - 1 || currentBottom < safeTop){
      console.log('currentTop ' + currentTop);
      console.log('currentBottom ' + currentBottom);
      console.log('safeTop ' + safeTop );
      console.log('safeBottom ' + safeBottom);
      se3();
      lose = true;
    }
    //新しいセーフエリアの設定
    else{
      //WIP
      //上下ともに，ハミ出したブロックは消す
      //消してから，落とす処理を加える
      console.log('currentTop ' + currentTop);
      console.log('currentBottom ' + currentBottom);
      console.log('safeTop ' + safeTop );
      console.log('safeBottom ' + safeBottom);
      //上にはみ出した分を消す
      if(safeTop > currentTop){
        var currentBlockWidth = blockWidth[progress];
        for(var x = currentX; x < currentX + currentBlockWidth; x++){
          for(var y = currentTop; y < safeTop; y++){
            // board[y][x] = 0;
            if(board[y][x] === 1){
              board[y][x] = 0;
            }
          }
        }
      }

      //下にはみ出した分を消す
      if(safeBottom < currentBottom){
        var currentBlockWidth = blockWidth[progress];
        for(var x = currentX; x < currentX + currentBlockWidth; x++){
          for(var y = safeBottom; y < ROWS; y++){
            if(board[y][x] === 1){
              // board[y][x] = 0;
              // setInterval(fadeOut(y, x), 50);
              // fadeOut(y,x);
            }
          }
        }
      }
    }

    safeTop = currentTop;
    safeBottom = currentBottom;

  }
}

//fadeout function
function fadeOut(y, x){
  console.log('fadeout');
  if(y < ROWS - 1){
    board[y + 1][x] = board[y][x];
    render();
  }
  board[y][x] = 0;
  // for(var j = y; j < ROWS - 1; j++){
  //   board[j][x] = 0;
  //   board[j + 1][x] = board[j][x];
  // }
}

// reflect 音
function se1(){
  document.getElementById( 'se1' ).play() ;
}

// enter 音
function se2(){
  document.getElementById( 'se2' ).play() ;
}

// gameover 音
function se3(){
  document.getElementById( 'se3' ).play() ;
  alert('game over');
  progress = 12;
  init();  // 盤面をまっさらにする
}

function clear(){
  alert('clear');
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


function go(){
  //ブロック速度の加速
  if(progress === 2){
    speed = speed - 5;
  }

  else if(progress === 4){
    speed = speed - 5;
  }

  else if(progress === 5){
    speed = speed - 5;
  }

  else if(progress === 7){
    speed = speed - 5;
  }

  console.log(speed);
  interval = setInterval(tick,speed);
}

//initialize
function newGame() {
  clearInterval(interval);  // ゲームタイマーをクリア
  init();  // 盤面をまっさらにする
  newShape();  // 操作ブロックをセット
  lose = false;  // 負けフラッグ
  // interval = setInterval( tick, speed );  // 250ミリ秒ごとにtickという関数を呼び出す
  // interval = go();
}

newGame();
go();
