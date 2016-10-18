/*
 現在の盤面の状態を描画する処理
 */
var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];  // キャンバス
var ctx = canvas.getContext( '2d' ); // コンテクスト
// var W = 300, H = 600;  // キャンバスのサイズ
//新キャンバスサイズ
var W = 1200, H = 800;  // キャンバスのサイズ
// var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;  // マスの幅を設定
var BLOCK_W = W / COLS, BLOCK_H = W / COLS;  // マスの幅を設定
var COLOR = '#000';

//画像
var src = "./img/ace.jpg";
var img = new Image();
img.src = src;

// x, yの部分へマスを描画する処理
function drawBlock( x, y ) {
  // ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
  // ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
  ctx.drawImage(img, BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1);
}


// 盤面と操作ブロックを描画する
function render() {
  ctx.clearRect( 0, 0, W, H );  // 一度キャンバスを真っさらにする
  ctx.strokeStyle = 'black';  // えんぴつの色を黒にする

  var currentHeight = blockPattern[progress].height;
  var currentWidth = blockPattern[progress].width;

  // 盤面を描画する
  for ( var x = 0; x < COLS; ++x ) {
    for ( var y = 0; y < ROWS; ++y ) {
      if ( board._table[ y ][ x ] ) {  // マスが空、つまり0ではなかったら
        ctx.fillStyle = COLOR;
        drawBlock( x, y );  // マスを描画
      }
    }
  }

  // 操作ブロックを描画する
  for ( var y = 0; y < currentHeight; ++y ) {
    for ( var x = 0; x < currentWidth; ++x ) {
      if ( current[ y ][ x ] ) {
        ctx.fillStyle = COLOR;
        drawBlock( currentX + x, currentY + y );  // マスを描画
      }
    }
  }
}

// 30ミリ秒ごとに状態を描画する関数を呼び出す
setInterval( render, 30 );
