const Author = (sequelize, DataTypes) => {
  return sequelize.define('author', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      },
      allowNull: true
    },
  });
}

export default Author;

