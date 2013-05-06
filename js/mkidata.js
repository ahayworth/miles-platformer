Quintus.MkiData = function(Q) {
  Q.assets["miles-sprites.json"] = { "miles": {"sx":0,"sy":1,"cols":5,"tilew":30,"tileh":25,"frames":5 } };
  Q.assets['qbox-sprites.json'] = {"qbox":{"sx":0,"sy":1,"cols":2,"tilew":32,"tileh":32,"frames":2}};
  Q.assets['level1_extras'] = {
    qboxen: [{x:620, y:2935}],
    enemies: [{x:660, y:2995}, {x:855, y:2995}, {x:905, y:2995}, {x:911, y:2675}, {x:1137, y:2675}],
    tower: {x:110, y:2643},
    player_start: {x:730, y:2960}
  }
  Q.assets['level2_extras'] = {
    player_start: { x:50, y:2960 },
    enemies: [{x:158, y:2960}, {x:400, y:2707}, {x:500, y:2707}, {x:600, y:2707}, {x:920, y:2707}, {x:1000, y:2707},
              {x:2128, y:2580}, {x:2123, y:2451}, {x:1926, y:2451}, {x:1747, y:2451}, {x:1504, y:2451}, {x:1190, y:2451},
              {x:910, y:2451}, {x:724, y:2451}, {x:474, y:2451}],
    tower: {x:50, y:2769},
    qboxen: [{x:1800, y:2400}, {x:1000, y:2400}]
  }
}
