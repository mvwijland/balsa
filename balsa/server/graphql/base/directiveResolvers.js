import { SchemaDirectiveVisitor } from 'graphql-tools';
import { ForbiddenError } from 'apollo-server-express';
import { DEMO_MODE } from '../../constants';

class NonDemoModeDirective extends SchemaDirectiveVisitor {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitFieldDefinition(field, _) {
    const { resolve } = field;
    field.resolve = async function(...args) {
      if (DEMO_MODE) {
        throw new ForbiddenError('Not available on demo mode.');
      }

      return await resolve.apply(this, args);
    };
  }
}

module.exports = {
  nonDemoMode: NonDemoModeDirective,
};
