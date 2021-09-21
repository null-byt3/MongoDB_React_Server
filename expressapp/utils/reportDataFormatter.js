import MongoHandler from "../Mongo/MongoHandler.js";

const mongoHandler = new MongoHandler();


export async function getMonthDateRange(username, month) {
  let expenses = []
  if (month) {
    const date = new Date();
    date.setMonth(month - 1)
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    expenses = await mongoHandler.getFromCostsByTimeRange(username, firstDay, lastDay)
  } else {
    expenses = await mongoHandler.getFromCosts(username);
  }

  const expensesByCategory = {}

  for (let expense of expenses) {
    const { category } = expense;
    if (!( category in expensesByCategory )) {
      expensesByCategory[category] = { amount: 0, sum: 0 }
    }
    expensesByCategory[category].amount++;
    expensesByCategory[category].sum += expense.sum;
  }

  return expensesByCategory;

}


