'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Thiết lập quan hệ giưa model hiện tại với model khác
    }
  }
  Account.init(
    {
      // Khai báo các cột trong tabel
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.TEXT,
    },
    {
      // Options
      sequelize,
      modelName: 'Account',
      tableName: 'accounts',

      // Mặc định sequelize sẽ tự động khai báo created_at và updated_at
      // Nếu muốn vô hiệu hóa => timestamps: false
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Account;
};