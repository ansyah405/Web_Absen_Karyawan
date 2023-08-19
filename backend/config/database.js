import Sequelize from "sequelize";

const db = new Sequelize('testdexa', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;