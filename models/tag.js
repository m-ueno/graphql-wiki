const Tag = (sequelize, DataTypes) => {
  return sequelize.define('tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};

export default Tag;
