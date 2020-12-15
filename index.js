const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');

const {constantManager,
  mapManager,
  monsterManager,
  itemManager,
  eventManager,
} = require('./datas/Manager');
const {Player} = require('./models/Player');

const app = express();
app.use(express.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

mongoose.connect(
    'mongodb+srv://gunnydo:gunnydo@cluster0.rhmxe.mongodb.net/Cluster0?retryWrites=true&w=majority',
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

  if (action === 'query') {
    field = mapManager.getField(req.player.x, req.player.y);
    const fieldEvent = eventManager.getEvent(field.event);
    event = {description: fieldEvent.description};
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

    const fieldEvent = eventManager.getEvent(field.event);

    event = {description: fieldEvent.description};
    await player.save();
  }
  const actions = [];

  field.canGo.forEach((canGo, i) => {
    actions.push({
      url: '/action',
      text: i,
      params: {direction: canGo},
    });
  });

  return res.send({player, field, event, actions});
});

app.listen(3000);
