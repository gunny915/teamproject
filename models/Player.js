const mongoose = require('mongoose');
const {getLevelEXP} = require('../utils.js');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: String,
  key: String,

  level: {type: Number, default: 1},
  maxHP: {type: Number, default: 30},
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
schema.methods.incrementEXP = function(val) {
  let isUp = false;
  let currentEXP = this.exp + val;
  let currentLVL = this.level;
  while (currentEXP >= getLevelEXP(currentLVL)) {
    currentEXP -= getLevelEXP(currentLVL);
    currentLVL += 1;
    this.str += 5;
    this.def += 5;
    this.maxHP += 20;
    this.HP = this.maxHP;
    isUp = true;
  }
  this.exp = currentEXP;
  this.level = currentLVL;
  return isUp;
};

const Player = mongoose.model('Player', schema);

module.exports = {
  Player,
};
