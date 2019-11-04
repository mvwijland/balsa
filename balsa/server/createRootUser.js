import { User } from './entities/user';
import argon2 from 'argon2';
import { createConnection } from 'typeorm';
import ormconfig from './ormconfig';
import dotenv from 'dotenv';
import { UserConfigurations } from './entities/userConfigurations';
import { Configurations } from './entities/configurations';

dotenv.config();

createConnection(...ormconfig)
  .then(async connection => {
    const check = await User.findOne({ role: User.ROLE_ADMIN });
    if (check) {
      console.log('A root user already exist.');
      return;
    }
    let rootUser = new User();
    rootUser.firstName = 'Balsa';
    rootUser.lastName = 'Admin';
    rootUser.email = 'dev@getbalsa.com';
    rootUser.password = await argon2.hash('123456');
    rootUser.jobTitle = User.ROLE_ADMIN;
    rootUser.role = User.ROLE_ADMIN;
    rootUser = await rootUser.save();

    const rootUserConfig = new UserConfigurations();
    rootUserConfig.user = rootUser;
    rootUserConfig.save();

    for (let i = 0; i < 5; i++) {
      let user = new User();
      user.firstName = `Dev ${i}`;
      user.lastName = 'User';
      user.email = `dev${i}@getbalsa.com`;
      user.password = await argon2.hash('123456');
      user.jobTitle = i % 2 === 0 ? User.ROLE_ADMIN : User.ROLE_USER;
      user.role = i % 2 === 0 ? User.ROLE_ADMIN : User.ROLE_USER;
      user = await user.save();

      const userConfig = new UserConfigurations();
      userConfig.user = user;
      userConfig.save();
    }

    const config = new Configurations();
    config.appInitialized = true;
    await config.save();

    console.log('Development users created successfully. Credentials are:');
    console.log('email: dev@getbalsa.com');
    console.log('password: 123456');
  })
  .catch(error => console.log(error));
