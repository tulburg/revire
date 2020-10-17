import Props from './props';
import { $RxElement } from './components';

function type(object: any) {
  return Object.prototype.toString.apply(object).split(' ')[1].slice(0, -1).toLowerCase();
}

const Parser = {
  render: function (component: $RxElement) {
    const styles: string[] = [];
    this.parseProperties(component, styles);
    component.$styles = styles;
  },

  parseFncStyles: function (fnc: string, comp: $RxElement, styles: string[]) {
    if (fnc.match(/(&|>)/)) {
      fnc = fnc.trim();
      const start = fnc.indexOf('&');
      const end = start + fnc.substr(start).indexOf('}') + 1;
      const rule = fnc.substr(start, end);
      const cssRule = rule.replace('&', comp.$tagName + '.'
        + comp.$className.split(' ')[0]).trim();
      if(cssRule.length > 20) {
        styles.push(cssRule);
      }
      const rem = fnc.replace(rule, '');
      if (rem.trim().length > 0) {
        Parser.parseFncStyles(rem, comp, styles);
      }
    } else if(fnc.match(/</)) {
      const start = fnc.indexOf('<');
      const end = start + fnc.substr(start).indexOf('}') + 1;
      const rule = fnc.substr(start, end);
      // Todo: Add exception to adding rules that involves the parent
      // during animation, or any term that will include external components

      // if(comp.root) {
      //   const cssRule = rule.replace('<', comp.root.tagName + '.' + comp.root.className).trim();
      //   if(cssRule.length > 20){
      //     styles.push(cssRule);
      //   }
      // }
      const rem = fnc.replace(rule, '');
      if (rem.trim().length > 0) {
        Parser.parseFncStyles(rem, comp, styles);
      }
    }else {
      return fnc;
    }
  },

  parseProperties: function (component: $RxElement | any, styles: string[]) {
    const properties: any = {};
    let componentStyles = component.$tagName+'.'
      + component.$className.split(' ')[0] + ' { ';
    const props = Object.getOwnPropertyNames(component);
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (Props.props.hasOwnProperty(prop)) {
        const f: any = Props.props[prop];
        if (type(f) === 'string') {
          if (f.match('attr.')) {
            properties[f.split('.')[1]] = component[prop];
          } else {
            componentStyles += f.split('.')[1] + ': '
              + Parser.parseStyleValue(component[prop]) + '; ';
          }
        } else if (type(f) === 'function') {
          if(component[prop]) {
            const fnc = f(component[prop], component);
            if(fnc !== undefined) {
              const parsed = Parser.parseFncStyles(fnc, component, styles);
              if (parsed !== undefined) componentStyles += parsed;
            }
          }
        }
      } else {
        if (prop === '$events' && component[prop] !== undefined) {
          properties[prop] = component[prop];
        } else if (Props.excludes.indexOf(prop) < 0 && component.$level !== 0) {
          // console.log(component);
          // throw new Error('Invalid property ' + prop);
        }
      }
    }
    if(componentStyles.length > 20) { styles.push(componentStyles + '} '); }
    return properties;
  },

  parseNativeStyle: function (obj: $RxElement | any, styles?: string[]) {
    let objStyles = '';
    for (let prop in obj) {
      prop = '$' + prop;
      if (Props.props.hasOwnProperty(prop)) {
        const f = Props.props[prop];
        if (typeof f === 'string') {
          if (f.match('css.')) {
            objStyles += f.split('.')[1] + ': '
              + Parser.parseStyleValue(obj[prop.slice(1)]) + '; ';
          }
        } else if (typeof f === 'function') {
          const fnc = f(obj[prop]);
          const parsed = Parser.parseFncStyles(fnc, obj, styles);
          if (parsed != undefined) objStyles += parsed;
        }
      } else {
        if (Props.excludes.indexOf(prop.toLowerCase()) < 0 && obj.$level != 0) {
          throw new Error('Invalid css property ' + prop);
        }
      }
    }
    return objStyles;
  },

  parseStyleValue: function (value: any) : any {
    if(value == null) {
      return 'unset';
    }else if(typeof value == 'string') {
      return value;
    }else if (typeof value == 'number') {
      return value + 'px';
    } else if (value instanceof Array) {
      return value.map(v => Parser.parseStyleValue(v)).join(' ');
    }
    return value;
  }
}

export default Parser;
