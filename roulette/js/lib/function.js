changeBg = function(){
  var query = location.search.substring(1).split('&')[0].split('=')[1];
  console.log(query);
  console.log($('.wrapper'));

  // if(query == 0){
  //   console.log('hit');
  //   $('.wrapper').css('background-image','url(./imgs/bg0.jpg)');
  // }

  return false;
}

$(function(){
  changeBg();
});
