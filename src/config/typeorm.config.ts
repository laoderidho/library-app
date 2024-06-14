import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',  // Default username untuk XAMPP
  password: '',      // Default password untuk XAMPP adalah kosong, jika Anda telah menetapkan password, gunakan password tersebut
  database: 'library',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
