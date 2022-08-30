const Habit = require('../models/Habit');
const TimePeriod = require('../models/TimePeriod');

module.exports = class GoalService {
  static async createHabits(goal) {
    const todaysDate = new Date();
    const timePeriodFrequency = await TimePeriod.getById(goal.timePeriodID);
    const habitCount = goal.timePeriodCount * timePeriodFrequency
    for (let i = 0; i < habitCount; i++) {
      const habit = await Habit.insert({
        habitName: goal.habitName,
        user_id: goal.user_id,
        dueDate: new Date(todaysDate + i),
        goalID: goal.id,
        statusID: 1
      });
      return habit;
    }
  }
};
  
