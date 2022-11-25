import { Visitor, NodePath } from '@babel/traverse';
import { addDefault } from '@babel/helper-module-imports';
import * as types from '@babel/types';
import template from '@babel/template';

import { getFuncName } from './helpers';

export enum ValueType {
  Return,
  Number,
}
interface Options {
  trackerModule: string;
  trackFuncs: { funcName: string; event: string; valueType: ValueType }[];
}
const TrackerTemplate = `
    %%Tracker%%(%%PlaceHolder%%)
`;

const trackerTemplateBuilder = template(TrackerTemplate);

const importTrackerModule = (funcPath: NodePath, trackerModule: string) => {
  return addDefault(funcPath, trackerModule, {
    nameHint: funcPath.scope.generateUid(trackerModule),
  }).name;
};

const handleBlockStatement = ({ funcPath, state, trackFuncInfo }) => {
  const node = funcPath.node as any;
  const { event } = trackFuncInfo;
  if (trackFuncInfo.valueType === ValueType.Number) {
    const tempArgumentObj = {
      Tracker: state.trackerImportId,
      PlaceHolder: `{ event: '${event}', value: 1 }`,
    };
    const templateNode = trackerTemplateBuilder(tempArgumentObj);
    node.body.body.unshift(templateNode);
    return;
  }

  funcPath.traverse({
    ReturnStatement: function (rsPath) {
      const returnValue = rsPath.getSource().replace('return', '');
      const tempArgumentObj = {
        PlaceHolder: `const __value__ =${returnValue}\n  ${state.trackerImportId}({ event: '${event}', value: __value__ });\n  return __value__;`,
      };
      const templateNode = trackerTemplateBuilder(tempArgumentObj);
      node.body.body.pop();
      node.body.body.push(templateNode);
    },
  });
};

const handleNonBlockStatement = ({ funcPath, state, trackFuncInfo }) => {
  const bodyPath = funcPath.get('body');
  const sourceCode = bodyPath.getSource();
  const { event } = trackFuncInfo;
  let tempArgumentObj;
  if (trackFuncInfo.valueType === ValueType.Number) {
    tempArgumentObj = {
      PlaceHolder: `{\n ${state.trackerImportId}({ event: '${event}', value: 1 });\n return ${sourceCode}; \n}`,
    };
  } else {
    tempArgumentObj = {
      PlaceHolder: `{\n  const __value__ = ${sourceCode};\n  ${state.trackerImportId}({ event: '${event}', value: __value__ });\n  return __value__;\n}`,
    };
  }

  const templateNode = trackerTemplateBuilder(tempArgumentObj);
  funcPath.node.body = templateNode;
};

const handleFunction = (
  { funcPath, state, trackFuncInfo },
  options: Options
) => {
  const { trackerModule } = options;
  if (!state.trackerImportId) {
    state.trackerImportId = importTrackerModule(funcPath, trackerModule);
  }

  const bodyPath = funcPath.get('body');
  const isBlockStatement = types.isBlockStatement(bodyPath);
  if (isBlockStatement) {
    handleBlockStatement({ funcPath, state, trackFuncInfo });
    return;
  }

  handleNonBlockStatement({ funcPath, state, trackFuncInfo });
};

export const createVisitor = (api, options: Options, dirname) => {
  const { trackerModule, trackFuncs } = options;
  if (!trackerModule || !trackFuncs)
    throw new Error('trackerModule or trackFuncs option are required!');

  const state: { [key: string]: unknown } = {};

  const visitor: Visitor = {
    Function(funcPath) {
      const funcName = getFuncName(funcPath);
      const trackFuncInfo = trackFuncs.find((f) => f.funcName === funcName);
      if (!trackFuncInfo) return;
      handleFunction({ funcPath, state, trackFuncInfo }, options);
    },
  };
  return visitor;
};
