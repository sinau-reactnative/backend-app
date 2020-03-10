const schedule = require("node-schedule");

module.exports = schedule.scheduleJob("44 * * * *", function() {
  console.log("The answer to life, the universe, and everything!");
});
