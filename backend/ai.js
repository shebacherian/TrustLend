function calculateScore(input) {
  let score = 50; // base score

  score += Number(input.recharge) / 100;
  score += Number(input.utilityScore) * 5;
  if (input.upiUsage === 'yes') score += 10;

  if (input.occupation === 'salaried') score += 10;
  if (input.occupation === 'self-employed') score += 5;

  score -= Number(input.missedPayments) * 5;

  // Limit score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  const approved = score >= 60; // rule: approve if score >= 60

  return { score, approved };
}

module.exports = { calculateScore };
