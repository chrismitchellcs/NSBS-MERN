module.exports = (req, res) => {
  if (req.url === "/api/test") {
    res.status(200).json({ message: "API working! ✅" });
  } else {
    res.status(404).json({ error: "Not found" });
  }
};
