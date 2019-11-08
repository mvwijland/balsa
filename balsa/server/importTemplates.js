import { createConnection } from 'typeorm';
import ormconfig from './ormconfig';
import dotenv from 'dotenv';

import { Template } from './entities/template';
import TEMPLATES_DATA from './templates.json';
import { TemplateCategory } from './entities/templateCategory';

dotenv.config();

const CATEGORIES = [
  { name: 'Bussiness', icon: 'el-icon-suitcase' },
  { name: 'Engineering', icon: 'el-icon-monitor' },
  { name: 'Design', icon: 'el-icon-picture-outline' },
];

createConnection(...ormconfig)
  .then(async connection => {
    const check = await Template.count();
    if (check) {
      console.log('Templates already exist.');
      return;
    }

    for (const category of CATEGORIES) {
      let categoryObject = new TemplateCategory();
      categoryObject.name = category.name;
      categoryObject.icon = category.icon;
      await categoryObject.save();
    }

    for (const templateData of TEMPLATES_DATA) {
      let templateObject = new Template();

      templateObject.name = templateData.name;
      for (const categoryId of templateData.categories) {
        if (!templateObject.categories) {
          templateObject.categories = [];
        }
        templateObject.categories.push(await TemplateCategory.findOne({ id: categoryId }));
      }
      templateObject.content = JSON.stringify(templateData.content);
      templateObject.contentHtml = templateData.contentHtml;

      templateObject.save();
    }
    console.log('Templates successfully imported.');
  })
  .catch(error => console.log(error));
