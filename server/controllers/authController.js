const checkPassword = async (req, res) => {
  const { password } = req.body;

  if (password == process.env.ADMIN_PASSWORD) {
    res.status(200).send("accepted");
  } else {
    res.status(400).send("incorrect password");
  }
};

module.exports = {
  checkPassword,
};
