const Habit = require('../models/Habit');
const TimePeriod = require('../models/TimePeriod');

module.exports = class GoalService {
  static async createHabits(goal) {
    const timePeriodFrequency = await TimePeriod.getById(goal.timePeriodID);
    const habitCounts = goal.timePeriodCount * timePeriodFrequency.dayCount;
    const habits = [];
    for (let i = 0; i < habitCounts; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + i);
      const habit = await Habit.insert({
        habitName: goal.habitName,
        user_id: goal.user_id,
        dueDate,
        goalID: goal.id,
        statusID: 1,
      });
      habits.push(habit);
    }
    return habits;
  }

  static async deleteHabits(goal_id) {
    const habits = await Habit.getByGoalId(goal_id);
    habits.forEach(async (habit) => {
      await Habit.delete(habit.id);
    });
    return habits;
  }
};
