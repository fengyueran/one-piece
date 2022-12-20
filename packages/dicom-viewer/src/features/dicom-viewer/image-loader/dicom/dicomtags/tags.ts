import { forEach } from 'lodash-es';
import tags from './dicomtags';
import { Tag, TagDict } from './types';

const standard = tags;

const nameMap: { [attr: string]: string } = {};

// adding key into definition
forEach(standard, (v, k) => {
  nameMap[v.name] = k;
});

const addCustomTags = (custom: TagDict): void => {
  forEach(custom, (v, k) => {
    standard[k] = v;
  });
  forEach(custom, (v, k) => {
    nameMap[v.name] = k;
  });
};

const checkTagValidation = (tagCode: string) => {
  const r = /^[0123456789abcdefABCDEF]+$/;
  return tagCode.length === 8 && tagCode.match(r);
};

const getJsonTagCodeFromName = (name: string): string | undefined => {
  let tagCode = nameMap[name];
  if (tagCode) {
    tagCode = tagCode.slice(1);
  } else {
    tagCode = name;
  }
  if (!checkTagValidation(tagCode)) {
    return undefined;
  }

  return tagCode.toLocaleUpperCase();
};

const getTagFromName = (name: string): Tag | undefined => {
  const tagCode = getJsonTagCodeFromName(name);
  if (tagCode === undefined) {
    return tagCode;
  }
  return standard[`x${tagCode.toLocaleLowerCase()}`];
};

export { getTagFromName, getJsonTagCodeFromName, addCustomTags, standard };
