const { DataTypes } = require("sequelize");
module.exports = {
  model_data_types: {
    UUID: DataTypes.UUIDV4,
    STRING: DataTypes.STRING,
    STRING_BINARY: DataTypes.STRING.BINARY,
    TEXT: DataTypes.TEXT,
    TINYTEXT: DataTypes.TEXT("tiny"),
    TSVECTOR: DataTypes.TSVECTOR,
    BOOLEAN: DataTypes.BOOLEAN,
    INTEGER: DataTypes.INTEGER,
    BIGINT: DataTypes.BIGINT,
    FLOAT: DataTypes.FLOAT,
    DOUBLE: DataTypes.DOUBLE,
    DECIMAL: DataTypes.DECIMAL,
    INTEGER_UNSIGNED: DataTypes.INTEGER.UNSIGNED,
    INTEGER_ZEROFILLED: DataTypes.INTEGER.ZEROFILL,
    INTEGER_UNSIGNED_ZEROFILLED: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
    DATETIME: DataTypes.DATE,
    DATE_ONLY: DataTypes.DATEONLY,
  },
};
