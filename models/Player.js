const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: String,
  key: String,

  level: {type: Number, default: 1},
  maxHP: {type: Number, default: 100},
  HP: {type: Number, default: 30},
  str: {type: Number, default: 10},
  def: {type: Number, default: 10},
  exp: {type: Number, default: 0},
  x: {type: Number, default: 0},
  y: {type: Number, default: 0},
});
schema.methods.incrementHP = function(val) {
  const hp = this.HP + val;
  this.HP = Math.min(Math.max(0, hp), this.maxHP);
};

const Player = mongoose.model('Player', schema);

module.exports = {
  Player,
};
