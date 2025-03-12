const userService = require('../Services/userService');
const userController = {
    async getUser(req, res) {
      try {
        const user = await userService.getUser(req.params.id);
        res.json(user);
      } catch (err) {
        res.status(404).json({ error: err.message });
      }
    },
    async createUser(req, res){
        try{
            const { userID, password, username } = req.body;
            const addedUser = await userService.createUser(userID, password, username);
            res.status(201).json(addedUser);
        }catch(err){
            res.status(400).json({error: err.message});
        }
    },
    async deleteUser(req, res){
      try{
        const deletedResult = await userService.deleteUser(req.params.id);
        res.json(deletedResult);
      }catch(err){
        res.status(400).json({error: err.message});
      }
    },
    async updateUserPassword(req,res){
      try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: "New password is required" });
        }
        const updatedResult = await userService.updateUserPassword(req.params.id, password);
        res.json(updatedResult);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
  }
};
module.exports = userController;