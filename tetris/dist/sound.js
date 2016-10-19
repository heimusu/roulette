SoundType = {
  Reflect: 0,
  Select: 1,
  GameOver: 2,
  Bgm: 3,
  Move: 4
}

SoundTable = [
  'se1',
  'se2',
  'se3',
  'bgm',
  'move'
];

Sound = function() {}

Sound.prototype.play = function(soundType) {
  document.getElementById(SoundTable[soundType]).play();
}

Sound.prototype.stop = function(soundType) {
  document.getElementById(SoundTable[soundType]).pause();
  document.getElementById(SoundTable[soundType]).currentTime = 0;
}
