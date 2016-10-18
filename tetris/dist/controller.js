/*
 キーボードを入力した時に一番最初に呼び出される処理
 */
document.body.onkeydown = function( e ) {
  // キーに名前をセットする
  var keys = {
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
