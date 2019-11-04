import { createConnection } from 'typeorm';
import ormconfig from './ormconfig';
import dotenv from 'dotenv';

import { Template } from './entities/template';
import TEMPLATES_DATA from './templates.json';

dotenv.config();

createConnection(...ormconfig)
  .then(async connection => {
    const check = await Template.count();
    if (check) {
      console.log('Templates already exist.');
      return;
    }

    for (const templateData of TEMPLATES_DATA) {
      let templateObject = new Template();
      templateObject.content = JSON.stringify(templateData);
      const title = templateData.content[0];
      if (title.type === 'title' && title.content) {
        templateObject.name = title.content[0].text;
      }
      templateObject.save();
    }
    console.log('Templates successfully imported.');
  })
  .catch(error => console.log(error));
