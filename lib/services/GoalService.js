const Habit = require('../models/Habit');
const TimePeriod = require('../models/TimePeriod');

module.exports = class GoalService {
  static async createHabits(goal) {
    const timePeriodFrequency = await TimePeriod.getById(goal.timePeriodID);
    const habitCounts = goal.timePeriodCount * timePeriodFrequency.dayCount;
    for (let i = 0; i < habitCounts; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + i);
      await Habit.insert({
        habitName: goal.habitName,
        user_id: goal.user_id,
        dueDate,
        goalID: goal.id,
        statusID: 1
      });
    }
  }
};
  
