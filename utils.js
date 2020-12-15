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

  if (event.id === 1) {
    // DEBUG
    const monster = monsterManager.getRandomMonster();
    eventTexts.push(`${monster.name}을(를) 마주했다.`);
    let playerHP = player.HP;
    let monsterHP = monster.hp;
    const playerAttack = Math.max(player.str - monster.def, 0);
    const monsterAttack = Math.max(monster.str - player.def, 0);

    while (playerHP > 0 && monsterHP > 0) {
      monsterHP -= playerAttack;
      eventTexts.push(`${player.name}이(가) ${playerAttack}만큼 ${monster.name}을(를) 해결했다.`);
      if (monsterHP <= 0) {
        // 몬스터 사망
        eventTexts.push(`\n${monster.name}을 모두 해결하였다.`);
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
        randomItemDrop(player);
        player.x = 0;
        player.y = 0;
        playerHP = player.maxHP;
        break;
      }
    }
    player.HP = playerHP;
  } else if (event.id === 2) {
    // OBTAIN
    const item = itemManager.getRandomItem();
    const itemName = item.name;
    player.items.push(itemName);
    player.str += item.str;
    player.def += item.def;
    eventTexts.push(`${itemName}을(를) 획득하였다! 디버깅이 쉬워지겠군`);
  } else if (event.id === 3) {
    // RESTORE
    const heal = getRandomElement([5, 10, 15]);
    eventTexts.push(`휴식시간이 주어져 체력이 ${heal}만큼 회복되었다.`);
    player.HP = Math.min(player.maxHP, player.HP + heal);
  }
  return eventTexts.join('\n');
};
const randomItemDrop = (player) => {
  // TODO: 랜덤으로 플레이어의 아이템을 잃어버린다.(능력치도 반영 필요)
};
module.exports = {
  getGameName,
  getField,
  getLevelEXP,
  eventHandler,
};
