const userDao = require("../DAO/userDAO");

const userService = {
    async getUser(id) {
      const user = await userDao.getUser(id);
      if (!user) throw new Error("User not found");
      return user;
    },
    async createUser(userID, password, username){
        if(!userID || !username || !password){
            throw new Error("Missing required user information");
        }
        return await userDao.putUser({userID, username, password});
    },
    async deleteUser(id){
        return await userDao.deleteUser(id);
    },
    async updateUserPassword(userID, password) {
        if (!userID || !password) {
            throw new Error("User ID and new password are required");
        }
        return await userDao.updateUserPassword(userID, password);
    }
};
module.exports = userService;