import { parseReplaceString } from "./util/replacePattern.js";
const getReplaceMatches = (args) => {
  const lastArg = args[args.length - 1];
  const hasGroups = typeof lastArg === "object" && lastArg !== null;
  const matchCount = args.length - (hasGroups ? 3 : 2);
  return args.slice(0, matchCount);
};
const applyReplacer = (input, replacer) => {
  const replacePattern = parseReplaceString(replacer.replace);
  return input.replace(replacer.search, (...args) => {
    const matches = getReplaceMatches(args);
    return replacePattern.buildReplaceString(matches);
  });
};
const renderTemplate = (params) => {
  const { template, object, replacers } = params;
  let input = template.replace(/(\$[A-Z_]+)/g, (_, k) => {
    let result;
    const isValidKey = (key) => key in object && object[key] !== void 0 && object[key] !== null;
    if (!isValidKey(k)) {
      result = k;
    } else if (typeof object[k] === "object") {
      result = renderTemplate({
        template: object[k].template,
        object: object[k]
      });
    } else {
      result = `${object[k]}`;
    }
    return result;
  });
  if (replacers) {
    for (const replacer of replacers) {
      input = applyReplacer(input, replacer);
    }
  }
  return input;
};
export {
  renderTemplate
};
