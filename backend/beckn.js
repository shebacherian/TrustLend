function search(req, res) {
  res.json({
    provider: "TrustLend",
    loan_types: ["Short-term", "Zero Collateral"],
    min_amount: 2000,
    max_amount: 10000
  });
}

module.exports = { search };
