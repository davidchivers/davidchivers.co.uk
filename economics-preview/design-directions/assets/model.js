// Two divisible goods; positive prices; lunch price is fixed at £6.
function budgetModel(income, coffeePrice, coffees, lunches) {
  const spent = coffeePrice * coffees + 6 * lunches;
  const remaining = income - spent;
  return {spent, remaining, coffeeIntercept: income / coffeePrice,
    lunchIntercept: income / 6, slope: -coffeePrice / 6,
    position: Math.abs(remaining) < 0.000001 ? 'on' : remaining > 0 ? 'under' : 'over'};
}
if (typeof module !== 'undefined') module.exports = budgetModel;
