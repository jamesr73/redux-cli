export const escapeRegEx = str => str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

export const escapedRegEx = str => new RegExp(escapeRegEx(str));

export const lineRegEx = (...pieces) =>
  new RegExp('(^|\\n)\\s*' + pieces.map(escapeRegEx).join('\\s+') + '(\\n|$)');
