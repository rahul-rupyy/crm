import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'boilerplate_db',
  entities: [],
});

const seed = async () => {
  await AppDataSource.initialize();
  console.log('Seeding started...');

  console.log('Seeding completed!');
  await AppDataSource.destroy();
};

seed();
