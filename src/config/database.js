module.exports = {
  dialect: 'postgres',
  host: '',
  username: 'postgres',
  password: 'docker',
  database: 'tcc',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
