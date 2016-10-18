SoundType = {
  Reflect: 1,
  Select: 2,
  GameOver: 3
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

