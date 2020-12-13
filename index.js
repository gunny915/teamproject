const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const crypto = require('crypto');

const {constantManager, mapManager, monsterManager, itemManager, eventManager} = require('./datas/Manager');
const {Player} = require('./models/Player');

const app = express();
app.use(express.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

mongoose.connect(
    'mongodb+srv://a123456789:ghtjdaleka@cluster0.wgnlx.mongodb.net/mudgame?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true},
);

const authentication = async (req, res, next) => {
  const {authorization} = req.headers;
  if (!authorization) return res.sendStatus(401);
  const [bearer, key] = authorization.split(' ');
  if (bearer !== 'Bearer') return res.sendStatus(401);
  const player = await Player.findOne({key});
  if (!player) return res.sendStatus(401);

  req.player = player;
  next();
};

app.get('/', (req, res) => {
  res.render('index', {gameName: constantManager.gameName});
});

app.get('/game', (req, res) => {
  res.render('game');
});

app.post('/signup', async (req, res) => {
  const {name} = req.body;

  if (await Player.exists({name})) {
    return res.status(400).send({error: 'Player already exists'});
  }

  const player = new Player({
    name,
    maxHP: 100,
    HP: 30,
    str: 10,
    def: 10,
    x: 0,
    y: 0,
    exp: 100,
  });

  const key = crypto.randomBytes(24).toString('hex');
  player.key = key;

  await player.save();

  return res.send({key});
});

app.post('/action', authentication, async (req, res) => {
  const {action} = req.body;
  const player = req.player;
  let event = null;
  let field = null;
  let actions = [];
  if (action === 'query') {
    field = mapManager.getField(req.player.x, req.player.y);
  } else if (action === 'move') {
    const direction = parseInt(req.body.direction, 0); // 0 북. 1 동 . 2 남. 3 서.
    let x = req.player.x;
    let y = req.player.y;
    if (direction === 0) {
      y -= 1;
    } else if (direction === 1) {
      x += 1;
    } else if (direction === 2) {
      y += 1;
    } else if (direction === 3) {
      x -= 1;
    } else {
      res.sendStatus(400);
    }
    field = mapManager.getField(x, y);
    if (!field) res.sendStatus(400);
    player.x = x;
    player.y = y;

    const events = field.events;
    const actions = [];
    if (events.length > 0) {
      // TODO : 확률별로 이벤트 발생하도록 변경
      const _event = events[0];
      if (_event.type === 'battle') {
        // TODO: 이벤트 별로 events.json 에서 불러와 이벤트 처리
        event = eventManager.getEvent(0);
        monster = monsterManager.getMonster(_event.monster);
        player.incrementHP(-1);
      } else if (_event.type === 'item') {
        event = eventManager.getEvent(1);
        player.incrementHP(1);
        item = itemManager.getItem(_event.item);
        player.HP = Math.min(player.maxHP, player.HP + 1);
      }
    }

    await player.save();
  }

  field.canGo.forEach((direction, i) => {
    if (direction === 1) {
      actions.push({
        url: '/action',
        text: i,
        params: {direction: i, action: 'move'},
      });
    }
  });

  return res.send({player, field, event, actions});
});

app.listen(3000);
