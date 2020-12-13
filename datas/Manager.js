/* eslint-disable require-jsdoc */
const fs = require('fs');

class Manager {
  constructor() { }
}

class ConstantManager extends Manager {
  constructor(datas) {
    super();
    this.gameName = datas.gameName;
  }
}

class MapManager extends Manager {
  constructor(datas) {
    super();
    this.id = datas.id;
    this.fields = {};

    datas.fields.forEach((field) => {
      this.fields[`${field[0]}_${field[1]}`] = {
        x: field[0],
        y: field[1],
        description: field[2],
        canGo: field[3],
        events: field[4],
      };
    });
  }

  getField(x, y) {
    return this.fields[`${x}_${y}`];
  }
}

class MonsterManager extends Manager {
  constructor(datas) {
    super();
    this.monsters = [];
    datas.forEach((monster) => {
      this.monsters.push({
        id : monster['id'],
        name : monster['name'],
        str : monster['str'],
        def : monster['def'],
        hp : monster['hp']
      })
    })
  }
}

class ItemManager extends Manager {
  constructor(datas) {
    super();
    this.items = [];
    datas.forEach((item) => {
      this.items.push({
        id : item['id'],
        name : item['name'],
        def : item['def']
      })
    })
  }
}

class EventManager extends Manager {
  constructor(datas) {
    super();
    this.events = [];
    datas.forEach((event) => {
      this.events.push({
        id : event['id'],
        name : event['name']
      })
    })
  }
}

const constantManager = new ConstantManager(
    JSON.parse(fs.readFileSync(__dirname + '/constants.json'))
);

const mapManager = new MapManager(
    JSON.parse(fs.readFileSync(__dirname + '/map.json'))
);

const monsterManager = new MonsterManager(
    JSON.parse(fs.readFileSync(__dirname + '/monsters.json'))
);

const itemManager = new ItemManager(
    JSON.parse(fs.readFileSync(__dirname + '/items.json'))
);

const eventManager = new EventManager(
    JSON.parse(fs.readFileSync(__dirname + '/events.json'))
);


module.exports = {
  constantManager,
  mapManager,
  monsterManager,
  itemManager,
  eventManager
};
