SoundType = {
  Reflect: 0,
  Select: 1,
  GameOver: 2 
}

SoundTable = [
  'se1',
  'se2',
  'se3'
];

Sound = function() {}

Sound.prototype.play = function(soundType) {
  document.getElementById(SoundTable[soundType]).play()
}

