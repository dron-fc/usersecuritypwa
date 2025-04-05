export default {
  async getAllUsers(db, req, res) {
    try {
      const users = await User.getAll(db);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
