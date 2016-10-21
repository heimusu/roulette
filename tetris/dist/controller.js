/*
 キーボードを入力した時に一番最初に呼び出される処理
 */
document.body.onkeydown = function( e ) {
  // キーに名前をセットする
  var keys = {
    13: 'enter',
    81: 'q'
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
    game.select();
    break;
  case 'q':
    // $('img').css('display', 'none');
    $('img').fadeOut();
    break;
  }
}
