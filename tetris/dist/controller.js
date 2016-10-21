/*
 キーボードを入力した時に一番最初に呼び出される処理
 */
document.body.onkeydown = function( e ) {
  // キーに名前をセットする
  var keys = {
    13: 'enter',
    81: 'q',
    87: 'w',
    83: 's',
    80: 'p'
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
    $('#img1').fadeOut();
    $('#img2').fadeOut();
    $('#img3').fadeOut();
    break;
  case 'w':
    $('#img3').fadeIn();
    document.getElementById(SoundTable[5]).play();
    break;
  case 's':
    document.getElementById(SoundTable[3]).pause();
    break;
  case 'p':
    document.getElementById(SoundTable[3]).currentTime = 21;
    document.getElementById(SoundTable[3]).play();
    break;
  }
}
