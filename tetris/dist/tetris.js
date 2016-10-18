var Block = function(_width, _height) {
  this.width = _width;
  this.height = _height;
};

var BlockPattern = [
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
];

var MaxProgress = BlockPattern.length - 1;
var SpeedTable = [110, 110, 105, 105, 100, 95, 95, 90, 90, 90, 90];

var Board = function() {
  this._table = [];
  this.width = 16;
  this.height = 12; 
};

Board.prototype.init = function() {
  for ( var y = 0; y < this.height; ++y ) {
    this._table[ y ] = [];
    for ( var x = 0; x < this.width; ++x ) {
      this._table[ y ][ x ] = 0;
    }
  }
};

var Game = function() {
  this.lose = null;  // 一番上までいっちゃったかどうか
  this.interval = null;  // ゲームを実行するタイマーを保持する変数
  this.speed = -1;
  this.breakFlg = 0;
  this.progress = 0;
  this.tickFlg = 0;
  this.minusFlg = 0;
  this.currentX = -1;
  this.currentY = -1; // 今操作しているブロックの位置
  this.board = new Board();
  this.sound = new Sound();
  this.safeTop = 0;
  this.safeBottom = this.board.height;
};

Game.prototype.freeze = function(){
  for(var y = 0; y < this.currentBlock.height; y++){
    for(var x = 0; x < this.currentBlock.width; x++){
      if((y + this.currentY) >= this.board.height){
        return false;
      }
      else if(this.currentY < 0){
        if(y < (this.currentBlock.height + this.currentY) )
          this.board._table[y][x + this.currentX] = 1;
      }
      else{
        this.board._table[y + this.currentY][x + this.currentX] = 1;
      }
    }
  }
};

Game.prototype.check = function(){
  //セーフなエリアのTOP
  // console.log(currentY);
  var currentTop = this.currentY;
  //セーフなエリアのBOTTOM
  // console.log(currentY + currentBlockHeight);
  var currentBottom = this.currentY + this.currentBlock.height;

  //大小判定
  if(currentTop < 0){
    currentTop = 0;
  }

  if(currentBottom >= this.height){
    currentBottom = this.height;
  }

  // 成否判定
  // 最初の一回は判定外
  if(this.progress === 0){
    this.safeTop = currentTop;
    this.safeBottom = currentBottom;
  }
  else if(this.progress === MaxProgress){
    this.clear();
  }
  //2ブロック目以降
  else{
    //低まったらゲームオーバー
    if(currentTop > this.safeBottom - 1 || currentBottom < this.safeTop){
      console.log('currentTop ' + currentTop);
      console.log('currentBottom ' + currentBottom);
      console.log('safeTop ' + this.safeTop );
      console.log('safeBottom ' + this.safeBottom);
      this.gameOver();
      this.lose = true;
    }
    //新しいセーフエリアの設定
    else{
      //WIP
      //上下ともに，ハミ出したブロックは消す
      //消してから，落とす処理を加える
      console.log('currentTop ' + currentTop);
      console.log('currentBottom ' + currentBottom);
      console.log('safeTop ' + this.safeTop );
      console.log('safeBottom ' + this.safeBottom);
      //上にはみ出した分を消す

      if(this.safeTop > currentTop){
        for(var x = this.currentX; x < this.currentX + this.currentBlock.width; x++){
          for(var y = currentTop; y < this.safeTop; y++){
            if(this.board._table[y][x] === 1){
              this.board._table[y][x] = 0;
            }
          }
        }
      }

      //下にはみ出した分を消す
      if(this.safeBottom < currentBottom){
        for(var x = this.currentX; x < this.currentX + this.currentBlock.width; x++){
          for(var y = this.safeBottom; y < this.height; y++){
            if(this.board._table[y][x] === 1){
              this.board._table[y][x] = 0;
            }
          }
        }
      }
    }

    this.safeTop = currentTop;
    this.safeBottom = currentBottom;
  }
};

Game.prototype.newShape = function() {
  var id = this.progress;
  if (this.currentBlock != null) {
    // ブロック配置後: 配置前のブロックの横幅を加算
    this.currentX += this.currentBlock.width;
  }
  else {
    // 初期設定
    this.currentX = 0;
  }
  this.currentY = 0;

  this.currentBlock = BlockPattern[id];
};

//画面の更新・ブロックの動きを司る関数
Game.prototype.tick = function() {
  //現在の高さ
  var currentHeight = this.currentBlock.height;

  //エスケープ処理
  if(currentHeight <= 1){
    currentHeight = 1;
  }

  //ブロックを下向きに動かす
  if(this.tickFlg === 0 && this.currentY < this.board.height - 1){
    ++this.currentY;
    //SEを鳴らす
    if(this.currentY === this.board.height - 1){
      this.sound.play(SoundType.Reflect);
    }
  }
  //ブロックを上向きに動かす
  else if(this.currentY < 0){
    if(this.currentY <= 0 && this.minusFlg === 0){
      --this.currentY;
      //エスケープ処理
      if(this.currentY === -currentHeight){
        this.sound.play(SoundType.Reflect);
        this.minusFlg = 1;
      }
    }
    //上限に達したらブロックの進行方向を下向きにする
    else if(this.currentY <= 0 && this.minusFlg === 1){
      this.currentY++;
      if(this.currentY === 0){
        this.minusFlg = 0;
        this.tickFlg = 0;
        return false;
      }
    }
  }
  //ブロックを上向きに動かす
  else {
    --this.currentY;
    this.tickFlg = 1;
  }
};

Game.prototype.gameOver = function() {
  this.sound.play(SoundType.GameOver);
  alert('game over');
  this.progress = 12;
  this.board.init();  // 盤面をまっさらにする
};

Game.prototype.clear = function() {
  alert('clear');
};

Game.prototype.go = function() {
  this.speed = SpeedTable[this.progress];
  var self = this;
  this.interval = setInterval(function(){self.tick()} ,self.speed);
};

//initialize
Game.prototype.newGame = function() {
  clearInterval(this.interval);  // ゲームタイマーをクリア
  this.board.init();  // 盤面をまっさらにする
  this.newShape();  // 操作ブロックをセット
  this.lose = false;  // 負けフラッグ
  // interval = setInterval( tick, speed );  // 250ミリ秒ごとにtickという関数を呼び出す
  // interval = go();
  this.go();
};

Game.prototype.select = function() {
  if(game.breakFlg === 0){
    clearInterval(game.interval);
    this.sound.play(SoundType.Select);
    this.freeze();
    this.check();
    this.progress++;
    this.tickFlg = 0;
    this.breakFlg = 1;
  }
  else if(game.breakFlg ===1 ){
    this.breakFlg = 0;
    this.newShape();
    this.go();
  }
}

var game = new Game();
game.newGame();
