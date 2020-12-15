/* eslint-disable max-len */
const {constantManager,
  mapManager,
  monsterManager,
  itemManager,
  eventManager,
  getRandomElement,
} = require('./datas/Manager');
const getGameName = () => {
  return constantManager.gameName;
};
const getField = (x, y) => {
  return mapManager.getField(x, y);
};

const getLevelEXP = (level) => {
  return 20 + (Math.max(parseInt(level) - 1, 0) * 10);
};
const eventHandler = (eventID, player) => {
  const event = eventManager.getEvent(eventID);
  const eventTexts = [event['description']];
  const eventId = event.id;
  switch (eventId) {
    case 1:
      eventTexts.push(debugMonster(player));
      break;
    case 2:
      // OBTAIN
      const item = itemManager.getRandomItem();
      const itemName = item.name;
      player.items.push(itemName);
      player.str += item.str;
      player.def += item.def;
      eventTexts.push(`${itemName}을(를) 획득하였다! 디버깅이 쉬워지겠군`);
      break;
    case 3:
      // RESTORE
      const heal = getRandomElement([5, 10, 15]);
      eventTexts.push(`휴식시간이 주어져 체력이 ${heal}만큼 회복되었다.`);
      player.HP = Math.min(player.maxHP, player.HP + heal);
      break;
    default:
      break;
  }
  return eventTexts.join('\n');
};
const debugMonster = (player) => {
  // DEBUG
  const monster = monsterManager.getRandomMonster();
  const eventTexts = [];
  eventTexts.push(`${monster.name}을(를) 마주했다.`);
  let playerHP = player.HP;
  let monsterHP = monster.hp;
  const playerAttack = Math.max(player.str - monster.def, 0);
  const monsterAttack = Math.max(monster.str - player.def, 0);
  let battleCount = 0;
  while (playerHP > 0 && monsterHP > 0) {
    battleCount += 1;
    if (battleCount === 10) {
      eventTexts.push(`무의미한 싸움이다...`);
      break;
    }
    monsterHP -= playerAttack;
    eventTexts.push(`${player.name}이(가) ${playerAttack}만큼 ${monster.name}을(를) 해결했다.`);
    if (monsterHP <= 0) {
      // 몬스터 사망
      eventTexts.push(`${monster.name}을 모두 해결하였다.`);
      if (player.incrementEXP(monster.exp)) {
        // TODO: 레벨업 시에, 문구 추가
        eventTexts.push();
      }
      break;
    }
    playerHP -= monsterAttack;
    eventTexts.push(`${monster.name}이(가) ${monsterAttack}만큼 ${player.name}을(를) 괴롭혔다.`);
    if (playerHP <= 0) {
      // 플레이어 사망
      eventTexts.push(`${monster.name}이(가) 프로젝트를 터트렸다.`);
      // 아이템 랜덤으로 잃어버리기
      const lostItemText = randomItemDrop(player);
      eventTexts.push(lostItemText);
      player.x = 0;
      player.y = 0;
      playerHP = player.maxHP;
      break;
    }
  }
  player.HP = playerHP;

  return eventTexts.join('\n');
};
const randomItemDrop = (player) => {
  if (player.items.length) {
    const items = player.items;
    const itemName = getRandomElement(items);
    const item = itemManager.getItemByName(itemName);
    player.str -= item.str;
    player.def -= item.def;
    const index = items.indexOf(itemName);
    items.splice(index, 1);
    player.items = items;
    return `${itemName}을(를) 잃어 능력치가 감소했다...`;
  }
  return '잃을 아이템도 없다...';
};
module.exports = {
  getGameName,
  getField,
  getLevelEXP,
  eventHandler,
};
