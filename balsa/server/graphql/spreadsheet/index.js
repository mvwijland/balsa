import { gql } from 'apollo-server-express';
import { BalsaFile } from '../../entities/balsaFile';
import { BehaviourLogger } from '../../logging/core';
import { BehaviourLog } from '../../entities/behaviourLog';
import { SPREADSHEET } from '../../constants';
import { Template } from '../../entities/template';
import stripHtml from 'string-strip-html';
import { EmailNotifier } from '../../utils';
import { EmailNotifications } from '../../entities/emailNotifications';
import { Contributor } from '../../entities/contributor';
import uuidv4 from 'uuid/v4';

const logger = new BehaviourLogger();
const typeDefs = gql`
  extend type Mutation {
    createSpreadsheet(templateId: Int, content: String, folderId: Int): File
    updateSpreadsheet(id: Int!, content: String): File
    deleteSpreadsheet(id: Int!): File
  }

  extend type Query {
    Spreadsheet(id: Int!): File
  }
`;

const inheritPermissions = async (folderId, newFile) => {
  const contribQb = Contributor.getRepository().createQueryBuilder('contrib');
  const contribs = await contribQb
    .leftJoinAndSelect('contrib.file', 'file')
    .leftJoinAndSelect('contrib.user', 'user')
    .where('file.id = :fileId', { fileId: parent.id })
    .getMany();

  for (const contrib of contribs) {
    const newContrib = new Contributor();
    newContrib.file = newFile;
    newContrib.user = contrib.user;
    newContrib.email = contrib.email;
    newContrib.permissionLevel = contrib.permissionLevel;
    newContrib.inviteCode = uuidv4();
    newContrib.isAnon = false;
    newContrib.save();
  }
};

const setChildPermissions = async (file, invitedUser, emails, permissionLevel) => {
  if (file.children) {
    for (const child of file.children) {
      const childContrib = new Contributor();
      childContrib.file = child;
      childContrib.user = invitedUser;
      childContrib.isAnon = false;
      if (permissionLevel) {
        childContrib.permissionLevel = permissionLevel;
      } else {
        childContrib.permissionLevel = file.defaultPermissionLevel;
      }
      childContrib.email = invitedUser.email;
      childContrib.save();

      // for getting children of children (nested) this retard shits lazy load is almost fake...
      const qb = BalsaFile.getRepository().createQueryBuilder('file');
      file = await qb
        .leftJoinAndSelect('file.contributors', 'contributors')
        .leftJoinAndSelect('file.children', 'children')
        .leftJoinAndSelect('contributors.user', 'user')
        .where('file.id = :id', { id: child.id })
        .andWhere('(user.email NOT IN (:...emails) OR contributors IS NULL)', { emails: emails })
        // .andWhere('file.user = :ownerId', { ownerId: user.id })
        .getOne();
      if (file.children) {
        setChildPermissions(child, invitedUser, emails, permissionLevel);
      }
    }
  }
};

const resolvers = {
  Mutation: {
    createSpreadsheet: async (_, { templateId, content, folderId }, context) => {
      const user = context.user;
      let parent;
      if (!user) {
        throw new Error('Login Required');
      }

      const newFile = new BalsaFile();

      if (folderId) {
        parent = await BalsaFile.findOne({ id: folderId });
        newFile.parent = parent;
      }
      newFile.name = 'Untitled';
      newFile.user = user;
      newFile.updatedAt = new Date();
      newFile.fileType = SPREADSHEET;

      if (templateId) {
        const template = await Template.findOne({ id: templateId });
        newFile.content = template.content;
      } else {
        newFile.content = content;
      }

      const savedFile = await newFile.save();

      if (folderId) {
        inheritPermissions(folderId, newFile);
      }

      logger.log(user, newFile, BehaviourLog.ACTION_CREATE_FILE);

      return savedFile;
    },
    updateSpreadsheet: async (_, { id, parentId, ...fields }, context) => {
      const user = context.user;
      const log = fields.log;
      const qb = BalsaFile.getRepository().createQueryBuilder('file');
      const file = await qb
        .leftJoinAndSelect('file.contributors', 'contributors')
        .leftJoinAndSelect('file.user', 'user')
        .leftJoinAndSelect('contributors.user', 'contributor')
        .where('file.id = :id', { id })
        .getOne();

      if (!file) {
        throw new Error('No file');
      }

      if (parentId && parentId !== 0) {
        file.parent = await BalsaFile.findOne({ id: parentId });
      } else if (parentId === 0) {
        file.parent = null;
      }

      Object.assign(file, fields);
      if (fields.contentHtml) {
        file.cleanedContent = stripHtml(fields.contentHtml);
      }
      if (user.id !== file.user.id && log) {
        for (const contrib of file.contributors) {
          if (user.id === contrib.user.id) {
            const date = new Date();
            contrib.updatedFileAt = date;
            await contrib.save();
          }
        }
      } else {
        file.updatedAt = new Date();
      }

      await file.save();

      if (log) {
        const notifier = new EmailNotifier();

        const usersToNotify = file.contributors.map(contrib => {
          if (contrib.user.id !== user.id) {
            return contrib.user;
          }
        });

        if (user.id !== file.user.id) {
          usersToNotify.push(file.user);
        }

        for (const userToNotify of usersToNotify) {
          notifier.notify(
            user,
            userToNotify,
            EmailNotifications.MODIFIED_MY_DOCUMENT,
            userToNotify.email,
            `${user.firstName} has modified your document.`,
            'modifiedDocument',
            {
              sender: user,
              file: file,
              url: file.getAbsoluteUrl(),
            },
          );
        }
      }

      logger.log(user, file, BehaviourLog.ACTION_UPDATE_FILE, false, true);

      return file;
    },
    deleteSpreadsheet: async (_, { id }) => {
      const folderToDelete = await BalsaFile.findOne({ id });
      if (!folderToDelete) {
        throw new Error('No Folder');
      }
      await folderToDelete.remove();
      logger.log(user, folderToDelete, BehaviourLog.ACTION_DELETE_FOLDER, true);
      return folderToDelete;
    },
  },
  Query: {
    Spreadsheet: async (_, { id }) => {
      const spreadsheet = await BalsaFile.findOne({
        where: { id, fileType: SPREADSHEET },
        relations: ['children', 'parent', 'user', 'contributors', 'contributors.user'],
      });
      return spreadsheet;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
