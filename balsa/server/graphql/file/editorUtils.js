import { Step } from 'prosemirror-transform';
import { Schema } from 'prosemirror-model';
import __schema from './schema.json';

const schema = new Schema(__schema);

export const updateDoc = (version, clientID, steps, file) => {
  let status, newSteps;
  if (!steps) {
    status = 'not_updated';
    let newSteps = null;
    return { file, newSteps, status };
  }
  steps = JSON.parse(steps);
  if (version === file.version) {
    const existingData = JSON.parse(file.content);
    let doc = schema.nodeFromJSON(existingData);
    newSteps = steps.map((step, index) => {
      const newStep = Step.fromJSON(schema, step);
      newStep.clientID = clientID;
      // apply step to document
      let result = newStep.apply(doc);
      doc = result.doc;
      const reply = { step: JSON.parse(JSON.stringify(newStep)) };
      reply.clientID = clientID;
      reply.version = file.version + index + 1;
      return reply;
    });
    file.version = file.version + steps.length;
    const stepHistory = JSON.parse(file.stepHistory);
    file.stepHistory = JSON.stringify(stepHistory.concat(newSteps));
    file.content = JSON.stringify(doc);
    status = 'updated';
  } else {
    const stepHistory = JSON.parse(file.stepHistory);
    newSteps = stepHistory.filter(step => step.version > version);
    status = 'version_mismatch';
  }

  return { file, newSteps, status };
};

export const getSteps = (version, file) => {
  const stepHistory = JSON.parse(file.stepHistory);
  return stepHistory.filter(step => step.version >= version);
};
