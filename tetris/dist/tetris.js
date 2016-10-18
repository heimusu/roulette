//旧サイズ
//var COLS = 10, ROWS = 20;  // 横10、縦20マス
//新サイズ
var COLS = 16, ROWS = 12;  // 横10、縦20マス
var board = null;
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

var Block = function(_width, _height) {
  this.width = _width;
  this.height = _height;
}

var blockPattern = [
  new Block(1,10),
  new Block(1,9),
  new Block(1,8),
  new Block(1,7),
  new Block(1,6),
  new Block(4,5),
  new Block(1,4),
  new Block(2,12),
  new Block(3,2),
  new Block(1,1)
]

var Board = function() {
  this._table = [];
}
Board.prototype.init = function() {
  for ( var y = 0; y < ROWS; ++y ) {
    this._table[ y ] = [];
    for ( var x = 0; x < COLS; ++x ) {
      this._table[ y ][ x ] = 0;
    }
  }
}

// shapesからランダムにブロックのパターンを出力し、盤面の一番上へセットする
function newShape() {
  var id = progress;
  var currentBlock = blockPattern[id];

  // パターンを操作ブロックへセットする
  current = [];
  for ( var y = 0; y < currentBlock.height; ++y ) {
    current[ y ] = [];
    for ( var x = 0; x < currentBlock.width; ++x ) {
      current[ y ][ x ] = id + 1;
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

//画面の更新・ブロックの動きを司る関数
function tick() {
  //現在の高さ
  var currentHeight = blockPattern[progress].height;

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
Board.prototype.valid = function ( offsetX, offsetY, newCurrent ) {
  // console.log(offsetY);
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || current;
  var currentHeight = blockPattern[progress].height;
  // console.log(currentHeight);
  for ( var y = 0; y < currentHeight; ++y ) {
    for ( var x = 0; x < 4; ++x ) {
      if ( newCurrent[ y ][ x ] ) {
        if ( typeof this._table[ y + offsetY ] == 'undefined'
             || typeof this._table[ y + offsetY ][ x + offsetX ] == 'undefined'
             || this._table[ y + offsetY ][ x + offsetX ]
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

Board.prototype.freeze = function(){
  // console.log(currentY);
  //現在のブロックのパラメータ
  var currentBlockHeight = blockPattern[progress].height;
  var currentBlockWidth = blockPattern[progress].width;

  //ブロックの描画
  for(var y = 0; y < currentBlockHeight; y++){
    for(var x = 0; x < currentBlockWidth; x++){
      if((y + currentY) >= ROWS){
        return false;
      }
      else if(currentY < 0){
        if(y < (currentBlockHeight + currentY) )
        this._table[y][x + currentX] = 1;
      }
      else{
        this._table[y + currentY][x + currentX] = 1;
      }
    }
  }
}

Board.prototype.check = function(){
  var currentBlockHeight = blockPattern[progress].height;
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

  else if(progress === 9){
    clear();
  }

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
      gameOver();
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
        var currentBlockWidth = blockPattern[progress].width;
        for(var x = currentX; x < currentX + currentBlockWidth; x++){
          for(var y = currentTop; y < safeTop; y++){
            // this._table[y][x] = 0;
            if(this._table[y][x] === 1){
              this._table[y][x] = 0;
            }
          }
        }
      }

      //下にはみ出した分を消す
      if(safeBottom < currentBottom){
        var currentBlockWidth = blockPattern[progress].width;
        for(var x = currentX; x < currentX + currentBlockWidth; x++){
          for(var y = safeBottom; y < ROWS; y++){
            if(this._table[y][x] === 1){
              this._table[y][x] = 0;
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
Board.prototype.fadeOut = function(y, x){
  console.log('fadeout');
  var currentBlockWidth = blockPattern[progress].width;
  for(var i = currentX; x < currentX + currentBlockWidth; x++){
    for(var j = y; j < ROWS - 1; j++){
      this._table[j][i] = 0;
      this._table[j + 1][i] = 1;
    }
  }
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
}

function gameOver() {
  se3();
  alert('game over');
  progress = 12;
  init();  // 盤面をまっさらにする
}

function clear(){
  alert('clear');
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
  board = new Board();
  clearInterval(interval);  // ゲームタイマーをクリア
  board.init();  // 盤面をまっさらにする
  newShape();  // 操作ブロックをセット
  lose = false;  // 負けフラッグ
  // interval = setInterval( tick, speed );  // 250ミリ秒ごとにtickという関数を呼び出す
  // interval = go();
}

newGame();
go();
