import { NativeEventType, RxElement } from './types';
import NativeClass from './native';
import {$RxElement} from './components';

const type = (o: any) => Object.prototype.toString.call(o).substr(8).replace(']','').toLowerCase();
const Native = function() : NativeClass {  return (<any>window).Native || undefined };

const $observeArray = (object: any, value: any, key: string) => {
  const val = value;
  const oldObj = object;
  const oldVal = val;

  value.push = (item: any) => {
    Array.prototype.push.call(value, item);
    if(Native() && Native().served) {
      if(key === '$children') {
        Native().$notify({
          old: oldObj, new: object, oldValue: oldVal, newValue: value,
          key: key, index: value.indexOf(item), count: 1
        }, NativeEventType.insert);
      }else if(key !== '$rules'){
        Native().$notify({
          old: oldObj, new: object, oldValue: oldVal, newValue: value, key: key
        }, NativeEventType.update);
      }
    }
  };

  value.pop = () => {
    const index = value.length - 1;
    Array.prototype.pop.call(value);
    if(Native() && Native().served) {
      Native().$notify({
        old: oldObj, index: index, count: 1
      }, NativeEventType.delete);
    }
  };

  value.shift = () => {
    Array.prototype.shift.call(value);
    if(Native() && Native().served) {
      Native().$notify({
        old: oldObj, index: 0, count: 1
      }, NativeEventType.delete);
    }
  };

  value.unshift = (item: any) => {
    Array.prototype.unshift.call(value, item);
    if(Native() && Native().served) {
      if(key === '$children') {
        Native().$notify({
          old: oldObj, new: object, oldValue: oldVal, newValue: value,
          key: key, index: 0, count: 1
        }, NativeEventType.update);
      }
    }
  };

  value.splice = (index: number, count: number, replace: any) => {
    if(value[index] && value[index].$level === 0) {
      const c = value[index];
      if(Native()) delete Native().components[c.name][c.nid];
    }
    if(Native() && Native().served) {
      if(replace) {
        Native().$notify({
          old: oldObj, new: replace, index: index
        }, NativeEventType.replace);
      }else {
        // send delete
        Native().$notify({
          old: oldObj, index: index, count: 1
        }, NativeEventType.delete);
      }
    }
    Array.prototype.splice.call(value, index, count, replace);
  };

  value.sort = (fn: Function) => {
    Array.prototype.sort.call(value, fn);
    if(Native() && Native().served) {
      Native().$notify({
        old: oldObj, new: object, oldValue: oldVal, newValue: value,
        key: key, index: 0, count: 0
      }, NativeEventType.sort);
    }
  };

  value.reverse = () => {
    Array.prototype.reverse.call(value);
    if(Native() && Native().served) {
      Native().$notify({
        old: oldObj, new: object, oldValue: oldVal, newValue: value,
        key: key, index: 0, count: 0
      }, NativeEventType.reverse);
    }
  };
};

export const Proxify = (object: RxElement) => {
  // proxify children
  if(object.$children) $observeArray(object, object.$children, '$children');
  return new Proxy(object, {
    get: (object, name, receiver) => {
      if(name == '__proxy__') return true;
      if(object.$hostComponent) {
        Native().lock = Native().lock || {} as any;
        if(object.name === undefined && type((<any>object)[name]) !== 'function' && type(name) === 'string') {
          Native().lock.key = Native().lock.key + '.' + <string>name;
        }
        if(type(name) !== 'symbol' && type((<any>object)[name]) !== 'function') {
          Native().lock.key = object.$tagName + '.' + object.$className + '.' + <string>name;
        }
        const [componentName, nid] = object.$hostComponent.split("-");
        Native().lock.type = 'property';
        Native().lock.className = componentName;
        Native().lock.nid = nid;
      }
      return Reflect.get(object, name, receiver);
    },
    set: (object, name, value, receiver) => {
      const old = (<any>object)[name];
      const oldObj = object;
      if (value && typeof value == 'object' && name != '__proto__' && name !== 'state'
        && name != 'root' && name != 'events' && name != '$node' && name != '$model' && name != '$styles') {
        if(value instanceof Array) {
          $observeArray(object, value, <string>name);
        }else if(!value.__proxy__){
          value = Proxify(value);
        }
      }
      (<any>object)[name] = value;
      if(name !== '__proto__' && name !== '$native' && object.$tagName !== 'window.RxElement'
        && name !== '$tagName' && name !== 'animations' && name !== '$node' && name !== '$root'
        && name !== '$className' && name !== '$children' && name !== '$styles' && name !== '$rules') {
        // Todo: if not a non RxElement property only
        if(object.$hostComponent) {
          const [componentName, nid] = object.$hostComponent.split("-");
          const instance = Native().components[componentName][nid];
          if(instance && instance.served) {
            // send notification to watchlist
            for(let i = 0; i < instance.watchlist.length; i++) {
              const w = instance.watchlist[i];
              if(w.prop === object.$tagName + '.' + object.$className + '.' + <string>name) {
                w.function(value, w.oldValue);
                w.oldValue = value;
              }
            }
          }
        }else {
          // console.log(object);
        }
      }
      if(name !== '__proto__' && name !== '$native' && object.$tagName !== 'window.RxElement'
        && name !== '$tagName' && name !== 'animations' && name !== '$node' && name !== '$root'
        && name !== '$className' && name !== '$children' && name !== '$styles' && name !== '$rules') {
        if(Native() && Native().served && object.$hostComponent) {
          Native().$notify({
            old: oldObj, new: object, oldValue: old, newValue: value, key: name as string
          }, NativeEventType.update);
        }
      }
      return Reflect.set(object, name, value, receiver);
    }
  });
};
const setLock = (object: any, componentName: string, name: string | number | symbol, nid: string, state = false) => {
  if(Native().shadowing || type(object[name]) === 'function' || type(name) === 'symbol' || (<string>name)[0] === '$' || (name === 'state')) return;
  Native().lock = Native().lock || <any>{};
  if(object.__state__ || object.name === componentName) {
    Native().lock.key = componentName + '.' + <string>name;
  }else {
    Native().lock.key = Native().lock.key + '.' + <string>name;
  }
  Native().lock.type = state ? 'state' : 'property';
  Native().lock.className = componentName;
  Native().lock.nid = nid;
}
export const ProxifyComponent = (object: RxElement, componentName: string, nid: string): RxElement => {
  // proxify children
  if(Native().shadowing) return object;
  if(object.$children) $observeArray(object, object.$children, '$children');
  return new Proxy(object, {
    get: (object, name: string, receiver) => {
      if(name == '__proxy__') return true;
      setLock(object, componentName, name, nid);
      return Reflect.get(object, name, receiver);
    },
    set: (object, name, value, receiver) => {
      const old = (<any>object)[name];
      const oldObj = object;
      setLock(object, componentName, name, nid);
      if(type(value) === 'object' && name !== '$children'
        && name !== '__root__' && name !== 'state' && name !== '$styles') {
        if(value instanceof $RxElement && !(<any>value).__proxy__) {
          // value = Proxify(value);
        }else if(!value.__proxy__) {
          value = ProxifyComponent(value, componentName, nid);
        }
      } else if (type(value) == 'array') {
        // statelyArray or something
      } else if (type(value) == 'function') {
        // do nothing
      }
      if(name != '__proto__') {
        (<any>object)[name] = value;
        const instance = Native().components[componentName][nid];
        if(instance && instance.served) {
          // send notification to watchlist
          for(let i = 0; i < instance.watchlist.length; i++) {
            const w = instance.watchlist[i];
            if(Native().lock && Native().lock.key === w.prop) {
              w.function(value);
              w.oldValue = value;
            }
          }
        }
      }
      if(name !== '__proto__' && name !== '$native' && object.$tagName !== 'window.RxElement'
        && name !== '$tagName' && name !== 'animations' && name !== '$node' && name !== '$root'
        && name !== '$className' && name !== '$children' && name !== '$rules'
        && (<any>name)[0] != '$') {
        if(Native() && Native().served && object instanceof $RxElement) {
          Native().$notify({
            old: oldObj, new: object, oldValue: old,
            newValue: value, key: name as string
          }, NativeEventType.update);
        }
      }
      return Reflect.set(object, name, value, receiver);
    }
  });
};

export const ProxifyState = (object: any, host: RxElement) => {
  if(Native().shadowing) return object;
  const setName = (object: any) => {
    for(let prop in object) {
      if(type(object[prop]) === 'object') {
        if(!object[prop].__proxy__) {
          object[prop] = ProxifyState(object[prop], host);
        }
      }
    }
  }
  setName(object);
  return new Proxy(object, {
    get: (object, name, receiver) => {
      if(name == '__proxy__') return true;
      setLock(object, host.name, name, host.$nid, true);
      return Reflect.get(object, name, receiver);
    },
    set: (object, name, value, receiver) => {
      const oldvalue = (<any>object)[name];
      setLock(object, host.name, name, host.$nid, true);
      if(type(value) === 'object' && name != '$children' && name != '__root__') {
        if(value instanceof $RxElement) {
          throw new Error(`Object of RxElement (${value}) cannot be set as stateful`);
        }else {
          if(!value.__proxy__) {
            value = ProxifyState(value, host);
          }
        }
      } else if (type(value) == 'array') {
        // statelyArray or something
      } else if (type(value) == 'function') {
        // throw error
      }
      (<any>object)[name] = value;
      if(Native() && Native().components[host.name][host.$nid].served) {
        // send notification to watchlist
        for(let i = 0; i < Native().components[host.name][host.$nid].watchlist.length; i++) {
          const w = Native().components[host.name][host.$nid].watchlist[i];
          if(Native().lock.key + '.' + <string>name === w.prop && w.oldValue == oldvalue) {
            w.function(value);
            w.oldValue = value;
          }
        }
        // trigger component redraw
        Native().updateState(host.name, host.$nid);
      }
      return Reflect.set(object, name, value, receiver);
    }
  });
};

[Boolean.prototype, Number.prototype, String.prototype, Array.prototype].map((o: any) => {
  o.watch = function(fn: Function) {
    if(fn) {
      const watcher: { object: any, prop: string, oldValue: any, function: Function } = {
        prop: Native().lock.key, oldValue: this, function: fn, object: undefined
      };
      const lock = Native().lock;
      if(Native().lock.type === 'state') {
        watcher.object = Native().components[lock.className][lock.nid].state;
      } else if(lock.type === 'property') {
        watcher.object = Native().components[lock.className][lock.nid];
      }
      if(Native().components[lock.className][lock.nid].watchlist.filter(i => {
        return i.function !== undefined;
        // return ''+i.function == ''+watcher.function && i.prop == watcher.prop;
      }).length < 1) {
        Native().components[lock.className][lock.nid].watchlist.push(watcher);
      }
    }
  };
});
