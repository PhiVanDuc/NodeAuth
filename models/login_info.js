'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Login_Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Login_Info.belongsTo(models.Account, {
        foreignKey: "account_id",
      })
    }
  }
  Login_Info.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    account_id: DataTypes.INTEGER,
    token: DataTypes.TEXT,
    token_status: DataTypes.BOOLEAN,
    browser_name: DataTypes.STRING,
    browser_version: DataTypes.STRING,
    os_name: DataTypes.STRING,
    os_version: DataTypes.STRING
  }, 
  {
    sequelize,
    modelName: 'Login_Info',
    tableName: 'login_infos',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Login_Info;
};