/*
 キーボードを入力した時に一番最初に呼び出される処理
 */
document.body.onkeydown = function( e ) {
  // キーに名前をセットする
  var keys = {
    37: 'left',
    39: 'right',
    40: 'down',
    38: 'rotate',
    13: 'enter'
  };

  if ( typeof keys[ e.keyCode ] != 'undefined' ) {
    // セットされたキーの場合はtetris.jsに記述された処理を呼び出す
    keyPress( keys[ e.keyCode ] );
    // 描画処理を行う
    render();
  }
};

// キーボードが押された時に呼び出される関数
function keyPress( key ) {
  switch ( key ) {
  case 'left':
    console.log('input left');
    if ( game.valid( -1 ) ) {
      --game.currentX;  // 左に一つずらす
    }
    break;
  case 'right':
    console.log('input right');
    if ( game.valid( 1 ) ) {
      ++game.currentX;  // 右に一つずらす
    }
    break;
  case 'down':
    console.log('input down');
    if ( game.valid( 0, 1 ) ) {
      ++game.currentY;  // 下に一つずらす
    }
    break;
  case 'enter':
    if(game.breakFlg === 0){
      game.sound.play(SoundType.Select);
      game.freeze();
      game.check();
      game.progress++;
      game.tickFlg = 0;
      clearInterval(game.interval);
      game.breakFlg = 1;
    }
    else if(game.breakFlg ===1 ){
      game.breakFlg = 0;
      game.newShape();
      game.go();
    }
    break;
  }
}
