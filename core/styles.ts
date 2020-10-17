import Native from "./native";

export const createSheet = function (data: string[]) {
  let style;
  const allStyles = document.head.getElementsByTagName('style');
  for(let n = 0; n < allStyles.length; n++) {
    if(allStyles[n].childNodes[0].nodeType == allStyles[n].TEXT_NODE
      && allStyles[n].childNodes.length == 1) {
      style = allStyles[n];
    }
  }
  if(!style) {
    style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
  }
  for (let i = 0; i < data.length; i++) {
    if (data[i].trim().length > 0 && !data[i].trim().match('{ }')) {
      const rule = data[i].trim();
      try {
        style.sheet.insertRule(rule, style.sheet.cssRules.length);
      } catch (e) {
        throw Error('Rule not applied: ' + rule + ' ' + e.message);
      }
    }
  }
  return style.sheet;
};

export const createRules = function(object: any, rules: string[]) {
  const sheet = ((<any>window).Native as Native).sheet;
  rules.forEach(css => {
    try {
      const length = sheet.cssRules.length;
      sheet.insertRule(css, length);
      object.$styles = object.$styles || [];
      object.$styles.push(<any>sheet.cssRules[length]);
    }catch(e) {
      throw new Error('Rule not applied: ' + css + e.message);
    }
  });
}

export const updateRules = function (object: any, rules: string[]) {
  if(!object.$styles || object.$styles.length === 0) return createRules(object, rules);
  rules.forEach(rule => {
    const selector = rule.substring(0, rule.indexOf('{')).trim();
    for(let i = 0; i < object.$styles.length; i++) {
      const css = object.$styles[i];
      if((<any>css).selectorText === selector) {
        console.log("found >", css, object.$node);
      }
    }
  });
};

export const updateClassRules = function(object: Element, rules: string[]) {
  return rules.map(css => {
    return css.replace(/([\.\b])\w+/g, '.' + object.className.split(' ').join('.'));
  });
}
//
// const extract = (rule: string) => {
//   return rule.trim().substring(rule.indexOf('{') + 1, rule.indexOf('}') - 2)
//     .trim().split(';').map(s => s.trim());
// };
// const pair = (v: string) => {
//   const value = v.split(':').map(s => s.trim());
//   return { name: value[0], value: value[1]};
// };
// const depair = (n: string, v: string) => {
//   return `${n}: ${v}`;
// };
