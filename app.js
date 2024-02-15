new Vue({
  el: "#app",
  data: {
    playerLife: 100,
    critChance: 0.15,
    monsterLife: 100,
    critMultiplier: 1.2,
    running: false,
    logs: [],
  },
  computed: {
    hasResult() {
      return this.playerLife == 0 || this.monsterLife == 0;
    },
  },
  methods: {
    reset() {
      this.playerLife = 100;
      this.monsterLife = 100;
      this.logs = [];
    },

    startGame() {
      this.running = true;
      this.reset();
    },

    giveUp() {
      this.running = false;
      this.reset();
    },

    attack(special) {
      this.hurt("monsterLife", 5, 10, special, "Player", "Monster", "player");
      if (this.monsterLife >= 0) {
        this.hurt("playerLife", 7, 12, false, "Monster", "Player", "monster");
      }
    },

    hurt(atr, min, max, special, source, target, cls) {
      const plus = special ? 5 : 0;
      const hurt = this.getRandom(min + plus, max + plus);
      this[atr] = Math.max(this[atr] - hurt.value, 0);
      text = hurt.isCrit
        ? `${source} Hits ${target} with ${hurt.value}, Critical Hit!`
        : `${source} Hits ${target} with ${hurt.value}.`;
      this.registerLog(text, cls);
    },

    healAndHurt() {
      this.heal(10, 12);
      this.hurt("playerLife", 7, 12, false, "Monster", "Player", "monster");
    },

    heal(min, max) {
      const heal = this.getRandom(min, max);
      this.playerLife = Math.min(heal.value + this.playerLife, 100);
      const text = heal.isCrit
        ? `Player heals with ${heal.value}, Critical Hit!`
        : `Player heals with ${heal.value}`;
      this.registerLog(text, "player-heal");
    },

    getRandom(min, max) {
      const value = Math.round(Math.random() * (max - min) + min);
      const critChance = Math.random();
      if (critChance <= this.critChance) {
        return {
          value: Math.round(value * this.critMultiplier),
          isCrit: true,
        };
      } else {
        return {
          value,
          isCrit: false,
        };
      }
    },

    registerLog(text, cls) {
      this.logs.unshift({ text, cls });
    },
  },
  watch: {
    hasResult(value) {
      if (value) this.running = false;
    },
  },
});
