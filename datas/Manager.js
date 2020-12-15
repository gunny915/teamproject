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
        canGo: field[2],
        event: field[3],
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
      this.monsters.push(monster);
    });
  }

  getMonster(id) {
    return this.monsters[id-1];
  }
  getRandomMonster() {
    return getRandomElement(this.monsters);
  }
}

class ItemManager extends Manager {
  constructor(datas) {
    super();
    this.items = [];
    datas.forEach((item) => {
      this.items.push(item);
    });
  }

  getItem(id) {
    return this.items[id-1];
  }
  getRandomItem() {
    return getRandomElement(this.items);
  }
  getItemByName(name) {
    return this.items.find((item) => {
      return item.name === name;
    });
  }
}

class EventManager extends Manager {
  constructor(datas) {
    super();
    this.events = [];
    datas.forEach((event) => {
      this.events.push(event);
    });
  }

  getEvent(id) {
    if (id === 5) {
      // 랜덤 이벤트의 경우 id 1에서 4중 임의의 id를 가져옴
      return this.events[getRandomElement([0, 1, 2, 3])];
    }
    return this.events[id-1];
  }
}

const constantManager = new ConstantManager(
    JSON.parse(fs.readFileSync(__dirname + '/constants.json')),
);

const mapManager = new MapManager(
    JSON.parse(fs.readFileSync(__dirname + '/map.json')),
);

const monsterManager = new MonsterManager(
    JSON.parse(fs.readFileSync(__dirname + '/monsters.json')),
);

const itemManager = new ItemManager(
    JSON.parse(fs.readFileSync(__dirname + '/items.json')),
);

const eventManager = new EventManager(
    JSON.parse(fs.readFileSync(__dirname + '/events.json')),
);
const getRandomElement = (arr) => {
  const size = arr.length;
  const randomIndex = Math.floor(Math.random() * size);
  return arr[randomIndex];
};
module.exports = {
  constantManager,
  mapManager,
  monsterManager,
  itemManager,
  eventManager,
  getRandomElement,
};
