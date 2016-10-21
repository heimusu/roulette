SoundType = {
  Reflect: 0,
  Select: 1,
  GameOver: 2,
  Bgm: 3,
  Move: 4,
  Clear: 5,
  Sr: 6,
  Ssr: 7
}

SoundTable = [
  'se1',
  'se2',
  'se3',
  'bgm',
  'move',
  'clear',
  'sr',
  'ssr'
];

Sound = function() {}

Sound.prototype.play = function(soundType) {
  if(soundType === 3){
    document.getElementById(SoundTable[soundType]).currentTime = 21;
    document.getElementById(SoundTable[soundType]).loop = true;
  }
  document.getElementById(SoundTable[soundType]).play();
}

Sound.prototype.stop = function(soundType) {
  document.getElementById(SoundTable[soundType]).pause();
  document.getElementById(SoundTable[soundType]).currentTime = 0;
}
