import Parser from './parser';
import {
  RxElement, ElementEvent, NativeLock, StyleProperties, flexAlignment, flexAlignmentItem, ConfigType,
  globalValues, colorType, borderStyleType, borderWidthType, imageType, spaceType, breakType, numberType
} from './types';
import { ProxifyComponent, ProxifyState } from './proxify';
import NativeClass from './native';
import {createRules} from './styles';

const type = (o: any) => Object.prototype.toString.call(o).substr(8).replace(']','').toLowerCase();
const Native = function() : NativeClass {  return (<any>window).Native || undefined };
function protoSet(base: any, chain: any, value: any) {
  if(base.hasOwnProperty(chain[0]) && chain.length > 1) {
    const newBase = base[chain[0]];
    chain.shift();
    protoSet(newBase, chain, value);
  }else {
    base[chain[0]] = value;
  }
}

export class $RxElement {

  $level = 1;
  $children: RxElement[] = [];
  $tagName = '$RxElement';
  $root: RxElement = undefined;
  $events: any = undefined;
  $className: string = undefined;
  $styles: Style[] = [];
  $pseudo: {[key: string]: StyleProperties}[] = [];
  $global: {[key: string]: StyleProperties}[] = [];

  // Layout function keys
  $absCenter?: boolean
  $absCenterRight?: numberType
  $absCenterLeft?: numberType
  $absCenterTop?: numberType
  $absCenterBottom?: numberType
  $absPosition?: numberType[]
  $absTopRight?: numberType[]
  $absTopLeft?: numberType[]
  $absBottomRight?: numberType[]
  $absBottomLeft?: numberType[]
  $absCenterVertical?: boolean
  $absCenterHorizontal?: boolean
  $addClassName?: boolean
  $animate?: boolean
  $animation?: boolean
  $aspectRatio?: boolean
  $backgroundLinearGradient?: colorType[]
  $childVerticalSpacing?: boolean
  $childHorizontalSpacing?: boolean
  $clearFix?: boolean
  $flexSpaceBetween?: boolean
  $flexCenter?: boolean
  $tag?: string
  $child?: boolean
  $removeClassName?: boolean
  $respond?: boolean
  $size?: numberType[] | numberType
  $stack?: boolean
  $stackVertical?: boolean
  $stackHorizontal?: boolean
  $truncateText?: boolean
  $responsiveness: {key: string, props: StyleProperties}[]
  $relCenterHorizontal: boolean

  // -- Render properties
  $hostComponent: string = (<any>window).Native.serving;
  $node: Element;
  // $styles: CSSStyleRule[] = [];
  $rules: CSSStyleRule[] = [];

  name = this.constructor.name;
  // get name() { return this.constructor.name };

  constructor(tagName?: string) {
    this.$tagName = tagName || this.$tagName;
    this.$className = this.$tagName[0].toLowerCase() + Math.random().toString(36).substr(2, 9);
    // return Proxify(this);
  }

  addChild(...children: RxElement[]): RxElement {
    if(children[0] instanceof Array) {
      throw `Cannot addChild: ${children[0]} is not valid RxElement`;
    }
    if(this.$children) {
      for(let i = 0; i < children.length; i++) {
        if(children[i].$root !== undefined) {
          throw `Cannot addChild: ${children[i].name} is already attached`;
        }
        const nullIndex = this.$children.indexOf(null);
        if(nullIndex > -1) this.$children.splice(nullIndex, 1, children[i])
        else this.$children.push(children[i]);
        children[i].$root = this;
      }
      return this;
    }else {
      throw `Cannot addChild: ${this.name} does not accept children`;
    }
  }

  removeChild(child: RxElement): RxElement {
    if(this.$children.indexOf(child) > -1) {
      child.$root = undefined;
      this.$children.splice(this.$children.indexOf(child), 1, null);
      return this;
    }else {
      console.warn(`Cannot removeChild: ${child.name} is not a child of ${this.name}`);
      // throw new Error(`Cannot removeChild: ${child.name} is not a child of ${this.name}`);
    }
  }

  replaceChild(child: RxElement, newChild: RxElement) {
    if(this.$children.indexOf(child) > -1) {
      if(newChild.$root != undefined) {
        throw `Cannot replaceChild: ${newChild.name} is already attched`;
      }
      this.$children.splice(this.$children.indexOf(child), 1, newChild);
      newChild.$root = this;
      return this;
    } else {
      // child doesnt exist on parent
    }
  }

  node(): Element { return this.$node; }
  parent(): RxElement { return this.$root; }
  children(): (RxElement | string)[] { return this.$children; }

  on(fns: ElementEvent | {[key: string]: (e?: Event) => void }): RxElement {
    this.$events = this.$events || [];
    for(const fn in fns) {
      const event: any = {};
      event[fn] = (<any>fns)[fn];
      if(type((<any>fns)[fn]) !== 'function') throw `${(<any>fns)[fn]} is not a function`;
      // console.log(Function.prototype.bind.apply(fns[fn], this), this);
      this.$events.push({
        event: (<any>fns)[fn].bind(this),
        name: fn, object: this
      });
      // Native.bindings[Native.serving.split('-')[1]]
      //   = Native.bindings[Native.serving.split('-')[1]] || [];
      // const binding = Native.bindings[Native.serving.split('-')[1]];
      // binding.push({ event: fns[fn], object: this, name: fn });
      // this.events.push(event);
    }
    return this;
  }

  bind(object: any): RxElement {
    if((<any>window).Native.serving) {
      const bonds = (<any>window).Native.components[(<any>window).Native.serving].bonds || [];
      if(bonds.indexOf(object) < 0) {
        for(const prop in object) {
          object[prop].source = this;
        }
        bonds.push(object);
      }
      (<any>window).Native.components[(<any>window).Native.serving].bonds = bonds;
    }
    return this;
  }

  text(string?: string): RxElement {
    if(string != undefined) {
      if(typeof this.$children[0] == 'string') this.$children.splice(0, 1, string as any);
      else this.$children.unshift(string as any);
      if(this.$node) (<any>this.$node).innerText = string;
      return this;
    }
    if(Object.prototype.toString.call(this.$children[0]) === '[object String]') {
      return this.$children[0];
    }
    return this;
  }

  styles(...styles: Style[]): any {
    if(arguments.length == 0) return <any>this.$styles;
    for(let i = 0; i < styles.length; i++) {
      if(styles[i].$className) {
        this.$className += ' ' + styles[i].$className;
        this.$styles.push(styles[i]);
      }
    }
    return this;
  }

  removeStyle(...styles: Style[]): void {
    if(arguments.length == 0) throw 'Remove style: 0 arguments passed. Min. of 1 expected';
    for(let i = 0; i < styles.length; i++) {
      this.$styles = this.$styles.filter(s => s.$className === styles[i].$className);
      this.$className.replace(' ' + styles[i].$className, '');
    }
  }

  // functions

  $render() {
    return Parser.render(this);
  }

  pseudo(props: {[key: string]: StyleProperties}) {
    this.$pseudo.push(props);
    const rules: string[] = [];
    for(const key in props) {
      rules.push('.' + this.$className.replace(' ', '.') + key + ' {' + Parser.parseNativeStyle(props[key]) + '} ');
    }
    if(Native() && Native().sheet) {
      createRules(this, rules)
    }else {
      (<any>window).__native_load_queue = (<any>window).__native_load_queue || [];
      (<any>window).__native_load_queue.push(() => {
        createRules(this, rules);
      });
    }
    return this;
  }

  global(props: {[key: string]: StyleProperties}) {
    this.$global.push(props);
    const rules: string[] = [];
    for(const key in props) {
      rules.push('.' + this.$className + ' ' + key + ' {' + Parser.parseNativeStyle(props[key]) + '} ');
    }
    if(Native() && Native().sheet) {
      createRules(this, rules);
    }else {
      (<any>window).__native_load_queue = (<any>window).__native_load_queue || [];
      (<any>window).__native_load_queue.push(() => {
        createRules(this, rules);
      });
    }
    return this;
  }

  alignContent: (_?: flexAlignment) => RxElement
  alignItems: (_?: flexAlignmentItem) => RxElement
  alignSelf: (_?: flexAlignmentItem) => RxElement
  animationDelay: (_?: string | string[]) => RxElement
  animationDirection: (_?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | string | string[] | globalValues) => RxElement
  animationDuration: (_?: string | string[] | globalValues) => RxElement
  animationFillMode: (_?: 'none' | 'forwards' | 'backwards' | 'both' | string | string[] | globalValues) => RxElement
  animationIterationCount: (_?: 'infinite' | string | string[] | globalValues) => RxElement
  animationName: (_?: 'none' | '-specific' | 'sliding-vertically' | 'sliding' | string | string[] | globalValues) => RxElement
  animationPlayState: (_?: 'running' | 'paused' | string | string[] | globalValues) => RxElement
  animationTimingFunction: (_?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'step-start' | 'step-end' |  string | string[] | globalValues) => RxElement
  backfaceVisibility: (_?: 'visible' | 'hidden' | string | string[] | globalValues) => RxElement
  background: (_?: string | string[] | globalValues) => RxElement
  backgroundAttachment: (_?: 'scroll' | 'fixed' | 'local' | string | string[] | globalValues) => RxElement
  backgroundClip: (_?: 'border-box' | 'padding-box' | 'content-box' | 'text' | string | string[] | globalValues) => RxElement
  backgroundColor: (_?: colorType) => RxElement
  backgroundImage: (_?: imageType) => RxElement
  backgroundOrigin: (_?: 'border-box' | 'padding-box' | 'content-box' | string | string[] | globalValues) => RxElement
  backgroundPosition: (_?: 'top' | 'bottom' | 'left' | 'right' | 'center' | string | number | string[] | number[] | globalValues) => RxElement
  backgroundPositionX: (_?: 'left' | 'center' | 'right' | string | number | string[] | globalValues) => RxElement
  backgroundPositionY: (_?: 'top' | 'center' | 'bottom' | string | number | string[] | globalValues) => RxElement
  backgroundRepeat: (_?: 'repeat-x' | 'repeat-y' | 'repeat' | 'space' | 'round' | 'no-repeat' | string | string[] | globalValues) => RxElement
  backgroundSize: (_?: 'cover' | 'contain' | string | number | string[] | number[] | globalValues) => RxElement
  border: (_?: borderStyleType | borderWidthType | string | number | string[] | globalValues) => RxElement
  borderBottom: (_?: borderStyleType | borderWidthType | string | number | string[] | globalValues) => RxElement
  borderBottomColor: (_?: colorType) => RxElement
  borderBottomLeftRadius: (_?: string | number | string[] | number[] | globalValues) => RxElement
  borderBottomRightRadius: (_?: string | number | string[] | number[] | globalValues) => RxElement
  borderBottomStyle: (_?: borderStyleType) => RxElement
  borderBottomWidth: (_?: borderWidthType) => RxElement
  borderCollapse: (_?: 'collapse' | 'separate' | string | globalValues) => RxElement
  borderColor: (_?: colorType) => RxElement
  borderImage: (_?: 'url()' | 'linear-gradient()' | string | string[] | globalValues) => RxElement
  borderImageOutset: (_?: number | number[] | globalValues) => RxElement
  borderImageRepeat: (_?: 'stretch' | 'repeat' | 'round' | 'space' | string | string[] | globalValues) => RxElement
  borderImageSlice: (_?: 'fill' | string | number | string[] | number[] | globalValues) => RxElement
  borderImageSource: (_?: imageType) => RxElement
  borderImageWidth: (_?: 'auto' | string | number | string[] | number[] | globalValues) => RxElement
  borderLeft: (_?: borderStyleType | borderWidthType | string | number | string[] | globalValues) => RxElement
  borderLeftColor: (_?: colorType) => RxElement
  borderLeftStyle: (_?: borderStyleType) => RxElement
  borderLeftWidth: (_?: borderWidthType) => RxElement
  borderRadius: (_?: string | number | string[] | number[] | globalValues) => RxElement
  borderRight: (_?: borderStyleType | borderWidthType | string | number | string[] | globalValues) => RxElement
  borderRightColor: (_?: colorType) => RxElement
  borderRightStyle: (_?: borderStyleType) => RxElement
  borderRightWidth: (_?: borderWidthType) => RxElement
  borderSpacing: (_?: number | number[] | globalValues) => RxElement
  borderStyle: (_?: borderStyleType) => RxElement
  borderTop: (_?: borderStyleType | borderWidthType | string | number | string[] | globalValues) => RxElement
  borderTopColor: (_?: colorType) => RxElement
  borderTopLeftRadius: (_?: string | number | string[] | number[] | globalValues) => RxElement
  borderTopRightRadius: (_?: string | number | string[] | number[] | globalValues) => RxElement
  borderTopStyle: (_?: borderStyleType) => RxElement
  borderTopWidth: (_?: borderWidthType) => RxElement
  borderWidth: (_?: borderWidthType) => RxElement
  bottom: (_?: spaceType) => RxElement
  boxDecorationBreak: (_?: 'slice' | 'clone' | string | globalValues) => RxElement
  boxShadow: (_?: 'none' | string | string[] | globalValues) => RxElement
  boxSizing: (_?: 'border-box' | 'content-box' | globalValues) => RxElement
  breakAfter: (_?: breakType) => RxElement
  breakBefore: (_?: breakType) => RxElement
  breakInside: (_?: 'auto' | 'avoid' | 'avoid-page' | 'avoid-column' | 'avoid-region' | globalValues) => RxElement
  captionSide: (_?: 'top' | 'bottom' | 'left' | 'right' | 'top-outside' | 'bottom-outside' | globalValues) => RxElement
  caretColor: (_?: 'auto' | colorType) => RxElement
  clear: (_?: 'none' | 'left' | 'right' | 'both' | 'inline-start' | 'inline-end' | globalValues) => RxElement
  clip: (_?: 'rect()' | 'auto' | string | globalValues) => RxElement
  color: (_?: colorType) => RxElement
  columnCount: (_?: 'auto' | string | number | globalValues) => RxElement
  columnFill: (_?: 'auto' | 'balance' | 'balance-all' | globalValues) => RxElement
  columnGap: (_?: 'normal' | string | number | globalValues) => RxElement
  columnRule: (_?: borderStyleType | borderWidthType | string | number | number[]) => RxElement
  columnRuleColor: (_?: colorType) => RxElement
  columnRuleStyle: (_?: borderStyleType) => RxElement
  columnRuleWidth: (_?: borderWidthType) => RxElement
  columnSpan: (_?: 'none' | 'all' | globalValues) => RxElement
  columnWidth: (_?: 'auto' | string | number | globalValues) => RxElement
  columns: (_?: 'auto' | string | number | string[] | globalValues) => RxElement
  content: (_?:  'none' | 'normal' | 'attr()' | 'open-quote | close-quote' | 'no-open-quote | no-close-quote' | string | string[] | globalValues) => RxElement
  counterIncrement: (_?: 'none' | string | number | string[] | globalValues) => RxElement
  counterReset: (_?: 'none' | string | number | string[] | globalValues) => RxElement
  counterSet: (_?: 'none' | string | number | string[] | globalValues) => RxElement
  cursor: (_?: 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' |
    'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'grab' | 'grabbing' | 'all-scroll' | 'col-resize' | 'row-resize' | 'n-resize' | 'e-resize' |
    's-resize' | 'w-resize' | 'ne-resize' | 'nw-resize' | 'se-resize' | 'sw-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' |
    'zoom-in' | 'zoom-out' | 'url()' | string | globalValues) => RxElement
  direction: (_?: 'ltr' | 'rtl' | globalValues) => RxElement
  display: (_?: 'block' | 'inline' | 'run-in' | 'flow' | 'flow-root' | 'table' | 'flex' | 'grid' | 'ruby' | 'list-item' | 'table-row-group' | 'table-header-group' |
    'table-footer-group' | 'table-row' | 'table-cell' | 'table-column-group' | 'table-column' | 'table-caption' | 'ruby-base' | 'ruby-text' | 'ruby-base-container' |
    'ruby-text-container' | 'contents' | 'none' | 'inline-block' | 'inline-list-item' | 'inline-table' | 'inline-flex' | 'inline-grid' | string | string[] | globalValues) => RxElement
  emptyCells: (_?: 'show' | 'hide' | globalValues) => RxElement
  filter: (_?: 'url()' | 'blur()' | 'brightness()' | 'contrast()' | 'drop-shadow()' | 'grayscale()' | 'hue-rotate()' | 'invert()' | 'opacity()' | 'saturate()' |
    'sepia()' | 'none' | string | globalValues) => RxElement
  flex: (_?: 'auto' | 'inital' | 'none' | string | number | number[] | globalValues) => RxElement
  flexBasis: (_?: 'fill' | 'max-content' | 'min-content' | 'fit-content' | 'content' | string | number | globalValues) => RxElement
  flexDirection: (_?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | globalValues) => RxElement
  flexFlow: (_?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'nowrap' | 'wrap' | 'wrap-reverse' | string | string[] | globalValues) => RxElement
  flexGrow: (_?: string | globalValues) => RxElement
  flexShrink: (_?: string | globalValues) => RxElement
  flexWrap: (_?: 'nowrap' | 'wrap' | 'wrap-reverse' | globalValues) => RxElement
  float: (_?: 'left' | 'right' | 'none' | 'inline-start' | 'inline-end' | globalValues) => RxElement
  font: (_?: 'caption' | 'icon' | 'menu' | 'message-box' | 'small-caption' | 'status-bar' | StyleProperties['fontFamily'] | StyleProperties['fontSize'] | StyleProperties['fontStretch'] |
    StyleProperties['fontStyle'] | StyleProperties['fontVariant'] | StyleProperties['fontWeight'] | StyleProperties['lineHeight']| string | string[] | globalValues) => RxElement
  fontFamily: (_?: 'serif' | 'sans-serif' | 'monospace' | 'cursive' | 'fantasy' | 'system-ui' | 'ui-serif' | 'ui-sans-serif' | 'ui-monospace' | 'ui-rounded' | 'emoji' | 'math' | 'fangsong' | string | string[] | globalValues) => RxElement
  fontFeatureSettings: (_?: 'normal' | 'smcp' | 'swsh' | string | globalValues) => RxElement
  fontKerning: (_?: 'auto' | 'normal' | 'none') => RxElement
  fontLanguageOverride: (_?: 'normal' | string | globalValues) => RxElement
  fontSize: (_?: 'xx-small' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'xx-large' | 'xxx-large' | 'smaller' | 'larger' | string | number | globalValues) => RxElement
  fontSizeAdjust: (_?: 'none' | string | globalValues) => RxElement
  fontSmooth: (_?: 'auto' | 'never' | 'always' | number | string | StyleProperties['fontSize']) => RxElement
  fontStretch: (_?: 'ultra-condensed' | 'extra-condensed' | 'condensed' | 'semi-condensed' | 'normal' | 'semi-expanded' | 'expanded' | 'extra-expanded' | 'ultra-expanded' | string | globalValues) => RxElement
  fontStyle: (_?: 'normal' | 'italic' | 'oblique' | string | string[]) => RxElement
  fontSynthesis: (_?: 'none' | StyleProperties['fontWeight'] | StyleProperties['fontStyle'] | string) => RxElement
  fontVariant: (_?: 'common-ligatures' | 'no-common-ligatures' | 'discretionary-ligatures' | 'no-discretionary-ligatures' | 'historical-ligatures' | 'no-historical-ligatures' | 'contextual' | 'no-contextual' |
    'stylistic()' | 'historical-forms' | 'styleset()' | 'character-variant()' | 'swash()' | 'ornaments()' | 'annotation()' | 'small-caps' | 'all-small-caps' | 'petite-caps' | 'all-petite-caps' | 'unicase' |
    'titling-caps' | 'lining-nums' | 'oldstyle-nums' | 'diagonal-fractions' | 'stacked-fractions' | 'ordinal' | 'slashed-zero' | 'jis78' | 'jis83' | 'jis90' | 'jis04' | 'simplified' | 'traditional' |
    'full-width' | 'proportional-width' | 'ruby' | string) => RxElement
  fontVariantAlternates: (_?: 'normal' | 'historical-forms' | 'stylistic()' | 'styleset()' | 'character-variant()' | 'swash()' | 'ornaments()' | 'annotation()' | string | globalValues) => RxElement
  fontVariantCaps: (_?: 'normal' | 'small-caps' | 'all-small-caps' | 'petite-caps' | 'all-petite-caps' | 'unicase' | 'titling-caps' | globalValues) => RxElement
  fontVariantEastAsian: (_?: 'normal' | 'jis78' | 'jis83' | 'jis90' | 'jis04' | 'simplified' | 'traditional' | 'full-width' | 'proportional-width' | 'ruby' | string | globalValues) => RxElement
  fontVariantLigatures: (_?: 'normal' | 'none' | 'common-ligatures' | 'no-common-ligatures' | 'discretionary-ligatures' | 'no-discretionary-ligatures' | 'historical-ligatures' |
    'no-historical-ligatures' | 'contextual' | 'no-contextual' | globalValues) => RxElement
  fontVariantNumeric: (_?: 'lining-nums' | 'oldstyle-nums' | 'diagonal-fractions' | 'stacked-fractions' | 'ordinal' | 'slashed-zero' | string | globalValues) => RxElement
  fontVariantPosition: (_?: 'normal' | 'sub' | 'super' | globalValues) => RxElement
  fontWeight: (_?: 'normal' | 'bold' | 'lighter' | 'bolder' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | globalValues) => RxElement
  gap: (_?: number | number[] | string | string[] | globalValues) => RxElement
  grid: (_?: StyleProperties['gridTemplate'] | StyleProperties['gridTemplateRows'] | StyleProperties['gridAutoFlow'] | StyleProperties['gridAutoColumns'] | StyleProperties['gridTemplateAreas'] |
    StyleProperties['gridColumnGap'] | string | globalValues) => RxElement
  gridArea: (_?: 'auto' | 'span' | string | globalValues) => RxElement
  gridAutoColumns: (_?: 'auto' | 'max-content' | 'min-content' | 'minmax()' | 'fit-content()' | string | number | globalValues) => RxElement
  gridAutoFlow: (_?: 'row' | 'column' | 'dense' | 'row dense' | 'column desne' | globalValues) => RxElement
  gridColumn: (_?: StyleProperties['gridArea']) => RxElement
  gridColumnEnd: (_?: StyleProperties['gridArea']) => RxElement
  gridColumnGap: (_?: StyleProperties['columnGap']) => RxElement
  gridColumnStart: (_?: StyleProperties['gridArea']) => RxElement
  gridGap: (_?: numberType | number[]) => RxElement
  gridRow: (_?: numberType | number[]) => RxElement
  gridRowEnd: (_?: StyleProperties['gridArea']) => RxElement
  gridRowStart: (_?: StyleProperties['gridArea']) => RxElement
  gridTemplate: (_?: 'none' | string | globalValues) => RxElement
  gridTemplateAreas: (_?: StyleProperties['gridTemplate']) => RxElement
  gridTemplateColumns: (_?: 'subgrid' | 'masonry' | 'minmax()' | 'fit-content()' | 'repeat()' | string | StyleProperties['gridTemplate']) => RxElement
  gridTemplateRows: (_?: StyleProperties['gridTemplateColumns']) => RxElement
  hangingPunctuation: (_?: 'none' | 'first' | 'last' | 'force-end' | 'allow-end' | string | string[] | globalValues) => RxElement
  height: (_?: numberType) => RxElement
  hyphens: (_?: 'none' | 'manual' | 'auto' | globalValues) => RxElement
  isolation: (_?: 'auto' | 'isolate' | globalValues) => RxElement
  inset: (_?: 'auto' | string | number | string[] | number[] | globalValues) => RxElement
  insetBottom: (_?: StyleProperties['inset']) => RxElement
  insetLeft: (_?: StyleProperties['inset']) => RxElement
  insetRight: (_?: StyleProperties['inset']) => RxElement
  insetTop: (_?: StyleProperties['inset']) => RxElement
  justifyContent: (_?: 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'left' | 'right' | flexAlignment | 'safe center' | 'unsafe center' | globalValues) => RxElement
  justifySelf: (_?: flexAlignmentItem | flexAlignment) => RxElement
  justifyItems: (_?: flexAlignment | flexAlignmentItem | 'legacy right' | 'legacy left' | 'legacy center' | globalValues) => RxElement
  left: (_?: numberType) => RxElement
  letterSpacing: (_?: numberType) => RxElement
  lineBreak: (_?: 'auto' | 'loose' | 'normal' | 'strict' | 'anywhere' | globalValues) => RxElement
  lineHeight: (_?: numberType) => RxElement
  listStyle: (_?: StyleProperties['listStyleType'] | StyleProperties['listStyleImage'] | StyleProperties['listStylePosition']) => RxElement
  listStyleImage: (_?: 'none' | 'url()' | globalValues) => RxElement
  listStylePosition: (_?: 'inside' | 'outside' | globalValues) => RxElement
  listStyleType: (_?: 'none' | 'disc' | 'circle' | 'square' | 'decimal' | 'georgian' | 'trad-chinese-informal' | 'kannada' | '-' | '@<<custom>>' | globalValues) => RxElement
  margin: (_?: numberType | string | number | string[] | number[]) => RxElement
  marginBottom: (_?: numberType | string | number) => RxElement
  marginLeft: (_?: StyleProperties['marginBottom']) => RxElement
  marginRight: (_?: StyleProperties['marginBottom']) => RxElement
  marginTop: (_?: StyleProperties['marginBottom']) => RxElement
  maxHeight: (_?: 'none' | 'max-content' | 'min-content' | 'fit-content()' | numberType) => RxElement
  maxWidth: (_?: StyleProperties['maxHeight']) => RxElement
  minHeight: (_?: StyleProperties['maxHeight']) => RxElement
  minWidth: (_?: StyleProperties['maxHeight']) => RxElement
  mixBlendMode: (_?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' |
    'exclusion' | 'hue' | 'saturation' | 'color' | 'liminosity' | globalValues) => RxElement
  objectFit: (_?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down') => RxElement
  objectPosition: (_?: 'top' | 'left' | 'right' | 'bottom' | string | number | string[] | number[] | globalValues) => RxElement
  opacity: (_?: string | globalValues) => RxElement
  order: (_?: string | globalValues) => RxElement
  orphans: (_?: string | globalValues) => RxElement
  outline: (_?: StyleProperties['outlineColor'] | StyleProperties['outlineStyle'] | StyleProperties['outlineWidth']) => RxElement
  outlineColor: (_?: colorType | 'invert') => RxElement
  outlineOffset: (_?: string | number | globalValues) => RxElement
  outlineStyle: (_?: borderStyleType) => RxElement
  outlineWidth: (_?: borderWidthType) => RxElement
  overflow: (_?: StyleProperties['overflowX'] | StyleProperties['overflowY']) => RxElement
  overflowBlock: (_?: 'visible' | 'hidden' | 'scroll' | 'auto' | globalValues) => RxElement
  overflowHidden: (_?: StyleProperties['overflowBlock']) => RxElement
  overflowWrap: (_?: 'normal' | 'break-word' | 'anywhere' | globalValues) => RxElement
  overflowX: (_?: 'clip' | StyleProperties['overflowBlock']) => RxElement
  overflowY: (_?: 'clip' | StyleProperties['overflowBlock']) => RxElement
  padding: (_?: numberType | string | number | string[] | number[] | globalValues) => RxElement
  paddingBottom: (_?: numberType) => RxElement
  paddingLeft: (_?: numberType) => RxElement
  paddingRight: (_?: numberType) => RxElement
  paddingTop: (_?: numberType) => RxElement
  pageBreakAfter: (_?: 'auto' | 'always' | 'avoid' | 'left' | 'right' | 'recto' | 'verso' | globalValues) => RxElement
  pageBreakBefore: (_?: StyleProperties['pageBreakAfter']) => RxElement
  pageBreakInside: (_?: 'auto' | 'avoid' | globalValues) => RxElement
  perspective: (_?: 'none' | numberType) => RxElement
  perspectiveOrigin: (_?: 'center' | 'top' | 'bottom' | 'right' | string | globalValues) => RxElement
  pointerEvents: (_?: 'auto' | 'none' | 'visiblePainted' | 'visibleFill' | 'visibleStroke' | 'visible' | 'painted' | 'fill' | 'stroke' | 'all' | globalValues) => RxElement
  position: (_?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky') => RxElement | any
  quotes: (_?: 'none' | 'initial' | 'auto' | string | globalValues) => RxElement
  resize: (_?: 'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline' | globalValues) => RxElement
  right: (_?: numberType) => RxElement
  scrollBehavior: (_?: 'auto' | 'smooth' | globalValues) => RxElement
  tabSize: (_?: numberType) => RxElement
  tableLayout: (_?: 'auto' | 'fixed' | globalValues) => RxElement
  textAlign: (_?: 'left' | 'right' | 'center' | 'justify' | 'justify-all' | 'start' | 'end' | 'match-parent' | string | globalValues) => RxElement
  textAlignLast: (_?: 'auto' | 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | string | globalValues) => RxElement
  textCombineUpright: (_?: 'none' | 'all' | 'digits' | globalValues) => RxElement
  textDecoration: (_?: StyleProperties['textDecorationLine'] | StyleProperties['textDecorationColor'] | StyleProperties['textDecorationStyle'] |
    StyleProperties['textDecorationThickness']) => RxElement
  textDecorationColor: (_?: colorType) => RxElement
  textDecorationLine: (_?: 'none' | 'underline' | 'overline' | 'line-through' | 'blink' | string | globalValues) => RxElement
  textDecorationStyle: (_?: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | globalValues ) => RxElement
  textDecorationThickness: (_?: 'auto' | 'from-font' | number | string | globalValues) => RxElement
  textIndent: (_?: 'each-line' | 'hanging' | number | string | globalValues) => RxElement
  textJustify: (_?: 'none' | 'auto' | 'inter-word' | 'inter-character' | 'distribute') => RxElement
  textOrientation: (_?: 'mixed' | 'upright' | 'sideways-right' | 'sideways' | 'use-glyph-orientation' | globalValues) => RxElement
  textOverflow: (_?: 'clip' | 'ellipsis' | '-' | globalValues) => RxElement
  textShadow: (_?: StyleProperties['boxShadow']) => RxElement
  textTransform: (_?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width' | 'full-size-kana' | globalValues) => RxElement
  textUnderlinePosition: (_?: 'auto' | 'under' | 'left' | 'right' | string | globalValues) => RxElement
  top: (_?: numberType) => RxElement
  transform: (_?: 'none' | 'matrix()' | 'matrix3d()' | 'perspective()' | 'rotate()' | 'rotate3d()' | 'rotateX()' | 'rotateY()' | 'rotateZ()' | 'translate()' |
    'translate3d()' | 'translateX()' | 'translateY()' | 'translateZ()' | 'scale()' | 'scale3d()' | 'scaleX()' | 'scaleY()' | 'scaleZ()' | 'skew()' |
    'skewX()' | 'skewY()' | string | globalValues) => RxElement
  transformOrigin: (_?: 'center' | 'top' | 'right' | 'left' | 'bottom' | string | number | string[] | number[]) => RxElement
  transformStyle: (_?: 'flat' | 'preserve-3d' | globalValues) => RxElement
  transition: (_?: StyleProperties['transitionDelay'] | StyleProperties['transitionDuration'] | StyleProperties['transitionProperty'] | StyleProperties['transitionTimingFunction']) => RxElement
  transitionDelay: (_?: string | string[] | globalValues) => RxElement
  transitionDuration: (_?: number | string | globalValues) => RxElement
  transitionProperty: (_?: StyleProperties['animationName']) => RxElement
  transitionTimingFunction: (_?: StyleProperties['animationTimingFunction']) => RxElement
  unicodeBidi: (_?: 'normal' | 'embed' | 'isolate' | 'bidi-override' | 'isolate-override' | 'plaintext' | globalValues) => RxElement
  userSelect: (_?: 'none' | 'auto' | 'text' | 'contain' | 'all' | 'element' | globalValues) => RxElement
  verticalAlign: (_?: 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom' | number | string | globalValues) => RxElement
  visibility: (_?: 'visible' | 'hidden' | 'collapse' | globalValues) => RxElement
  whiteSpace: (_?: 'normal' | 'nowrap' | 'wrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces' | globalValues) => RxElement
  width: (_?: numberType) => RxElement
  wordBreak: (_?: 'normal' | 'break-all' | 'keep-all' | 'break-word' | globalValues) => RxElement
  wordSpacing: (_?: 'normal' | number | string | globalValues) => RxElement
  wordWrap: (_?: 'normal' | 'break-word' | 'anywhere' | globalValues) => RxElement
  writingMode: (_?: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | globalValues) => RxElement

  zIndex: (_?: string | globalValues) => RxElement
  // custom specials
  cornerRadius: (_?: StyleProperties['borderRadius']) => RxElement

  // attributes
  abbr: (_?: string | number | string[] | number[]) => RxElement
  accept: (_?: string) => RxElement
  acceptCharset: (_?: string | number | string[] | number[]) => RxElement
  accessKey: (_?: string | number | string[] | number[]) => RxElement
  action: (_?: string | number | string[] | number[]) => RxElement
  alink: (_?: string | number | string[] | number[]) => RxElement
  allow: (_?: string | number | string[] | number[]) => RxElement
  allowFullscreen: (_?: string | number | string[] | number[]) => RxElement
  allowPaymentRequest: (_?: string | number | string[] | number[]) => RxElement
  allowUserMedia: (_?: string | number | string[] | number[]) => RxElement
  alt: (_?: string | number | string[] | number[]) => RxElement
  archive: (_?: string | number | string[] | number[]) => RxElement
  as: (_?: string | number | string[] | number[]) => RxElement
  async: (_?: string | number | string[] | number[]) => RxElement
  attrHeight: (_?: string | number | string[] | number[]) => RxElement
  attrWidth: (_?: string | number | string[] | number[]) => RxElement
  autoCapitalize: (_?: string | number | string[] | number[]) => RxElement
  autoComplete: (_?: string | number | string[] | number[]) => RxElement
  autoFocus: (_?: string | number | string[] | number[]) => RxElement
  autoPlay: (_?: string | number | string[] | number[]) => RxElement
  axis: (_?: string | number | string[] | number[]) => RxElement
  capture: (_?: 'user' | 'environment') => RxElement
  cellPadding: (_?: string | number | string[] | number[]) => RxElement
  cellSpacing: (_?: string | number | string[] | number[]) => RxElement
  char: (_?: string | number | string[] | number[]) => RxElement
  charOff: (_?: string | number | string[] | number[]) => RxElement
  charset: (_?: string | number | string[] | number[]) => RxElement
  checked: (_?: string | number | string[] | number[]) => RxElement
  cite: (_?: string | number | string[] | number[]) => RxElement
  classId: (_?: string | number | string[] | number[]) => RxElement
  className: (_?: string | number | string[] | number[]) => RxElement
  clearAttr: (_?: string | number | string[] | number[]) => RxElement
  code: (_?: string | number | string[] | number[]) => RxElement
  codeBase: (_?: string | number | string[] | number[]) => RxElement
  codeType: (_?: string | number | string[] | number[]) => RxElement
  cols: (_?: string | number | string[] | number[]) => RxElement
  colSpan: (_?: string | number | string[] | number[]) => RxElement
  compact: (_?: string | number | string[] | number[]) => RxElement
  contentEditable: (_?: string | number | string[] | number[]) => RxElement
  controls: (_?: string | number | string[] | number[]) => RxElement
  coords: (_?: string | number | string[] | number[]) => RxElement
  crossOrigin: (_?: string | number | string[] | number[]) => RxElement
  d: (_?: string) => RxElement
  data: (_?: string | number | string[] | number[]) => RxElement
  datetime: (_?: string | number | string[] | number[]) => RxElement
  declare: (_?: string | number | string[] | number[]) => RxElement
  decoding: (_?: string | number | string[] | number[]) => RxElement
  dir: (_?: string | number | string[] | number[]) => RxElement
  dirname: (_?: string | number | string[] | number[]) => RxElement
  disabled: (_?: string | number | string[] | number[]) => RxElement
  download: (_?: string | number | string[] | number[]) => RxElement
  draggable: (_?: string | number | string[] | number[]) => RxElement
  enctype: (_?: string | number | string[] | number[]) => RxElement
  enterKeyHint: (_?: string | number | string[] | number[]) => RxElement
  fill: (_?: string) => RxElement
  form: (_?: string | number | string[] | number[]) => RxElement
  formAction: (_?: string | number | string[] | number[]) => RxElement
  formEnctype: (_?: string | number | string[] | number[]) => RxElement
  formMethod: (_?: string | number | string[] | number[]) => RxElement
  formNoValidate: (_?: string | number | string[] | number[]) => RxElement
  formTarget: (_?: string | number | string[] | number[]) => RxElement
  frame: (_?: string | number | string[] | number[]) => RxElement
  frameBorder: (_?: string | number | string[] | number[]) => RxElement
  headers: (_?: string | number | string[] | number[]) => RxElement
  hidden: (_?: string | number | string[] | number[]) => RxElement
  high: (_?: string | number | string[] | number[]) => RxElement
  href: (_?: string | number | string[] | number[]) => RxElement
  hrefLang: (_?: string | number | string[] | number[]) => RxElement
  hSpace: (_?: string | number | string[] | number[]) => RxElement
  id: (_?: string | number | string[] | number[]) => RxElement
  imageSizes: (_?: string | number | string[] | number[]) => RxElement
  imageSrcSet: (_?: string | number | string[] | number[]) => RxElement
  inputMode: (_?: string | number | string[] | number[]) => RxElement
  integrity: (_?: string | number | string[] | number[]) => RxElement
  is: (_?: string | number | string[] | number[]) => RxElement
  isMap: (_?: string | number | string[] | number[]) => RxElement
  itemId: (_?: string | number | string[] | number[]) => RxElement
  itemProp: (_?: string | number | string[] | number[]) => RxElement
  itemRef: (_?: string | number | string[] | number[]) => RxElement
  itemScope: (_?: string | number | string[] | number[]) => RxElement
  itemType: (_?: string | number | string[] | number[]) => RxElement
  kind: (_?: string | number | string[] | number[]) => RxElement
  label: (_?: string | number | string[] | number[]) => RxElement
  lang: (_?: string | number | string[] | number[]) => RxElement
  link: (_?: string | number | string[] | number[]) => RxElement
  list: (_?: string | number | string[] | number[]) => RxElement
  longDesc: (_?: string | number | string[] | number[]) => RxElement
  loop: (_?: string | number | string[] | number[]) => RxElement
  low: (_?: string | number | string[] | number[]) => RxElement
  marginHeight: (_?: string | number | string[] | number[]) => RxElement
  marginWidth: (_?: string | number | string[] | number[]) => RxElement
  max: (_?: string | number | string[] | number[]) => RxElement
  maxLength: (_?: string | number | string[] | number[]) => RxElement
  media: (_?: string | number | string[] | number[]) => RxElement
  method: (_?: string | number | string[] | number[]) => RxElement
  min: (_?: string | number | string[] | number[]) => RxElement
  minLength: (_?: string | number | string[] | number[]) => RxElement
  multiple: (_?: string | number | string[] | number[]) => RxElement
  muted: (_?: string | number | string[] | number[]) => RxElement
  attrName: (_?: string | number | string[] | number[]) => RxElement
  nonce: (_?: string | number | string[] | number[]) => RxElement
  noResize: (_?: string | number | string[] | number[]) => RxElement
  noShade: (_?: string | number | string[] | number[]) => RxElement
  noValidate: (_?: string | number | string[] | number[]) => RxElement
  noWrap: (_?: string | number | string[] | number[]) => RxElement
  object: (_?: string | number | string[] | number[]) => RxElement
  open: (_?: string | number | string[] | number[]) => RxElement
  optimum: (_?: string | number | string[] | number[]) => RxElement
  pattern: (_?: string | number | string[] | number[]) => RxElement
  ping: (_?: string | number | string[] | number[]) => RxElement
  placeholder: (_?: string | number | string[] | number[]) => RxElement
  playsInline: (_?: string | number | string[] | number[]) => RxElement
  poster: (_?: string | number | string[] | number[]) => RxElement
  preload: (_?: string | number | string[] | number[]) => RxElement
  profile: (_?: string | number | string[] | number[]) => RxElement
  prompt: (_?: string | number | string[] | number[]) => RxElement
  readOnly: (_?: string | number | string[] | number[]) => RxElement
  referrerPolicy: (_?: string | number | string[] | number[]) => RxElement
  rel: (_?: string | number | string[] | number[]) => RxElement
  required: (_?: string | number | string[] | number[]) => RxElement
  rev: (_?: string | number | string[] | number[]) => RxElement
  reversed: (_?: string | number | string[] | number[]) => RxElement
  rows: (_?: string | number | string[] | number[]) => RxElement
  rowSpan: (_?: string | number | string[] | number[]) => RxElement
  rules: (_?: string | number | string[] | number[]) => RxElement
  sandBox: (_?: string | number | string[] | number[]) => RxElement
  scope: (_?: string | number | string[] | number[]) => RxElement
  scrolling: (_?: string | number | string[] | number[]) => RxElement
  selected: (_?: string | number | string[] | number[]) => RxElement
  shape: (_?: string | number | string[] | number[]) => RxElement
  sizes: (_?: string | number | string[] | number[]) => RxElement
  slot: (_?: string | number | string[] | number[]) => RxElement
  span: (_?: string | number | string[] | number[]) => RxElement
  spellCheck: (_?: string | number | string[] | number[]) => RxElement
  src: (_?: string | number | string[] | number[]) => RxElement
  srcDoc: (_?: string | number | string[] | number[]) => RxElement
  srcSet: (_?: string | number | string[] | number[]) => RxElement
  standBy: (_?: string | number | string[] | number[]) => RxElement
  start: (_?: string | number | string[] | number[]) => RxElement
  step: (_?: string | number | string[] | number[]) => RxElement
  summary: (_?: string | number | string[] | number[]) => RxElement
  tabIndex: (_?: string | number | string[] | number[]) => RxElement
  target: (_?: string | number | string[] | number[]) => RxElement
  title: (_?: string | number | string[] | number[]) => RxElement
  attrTransform: (_?: string) => RxElement
  translate: (_?: string | number | string[] | number[]) => RxElement
  type: (_?: string | number | string[] | number[]) => RxElement
  typeMustMatch: (_?: string | number | string[] | number[]) => RxElement
  useMap: (_?: string | number | string[] | number[]) => RxElement
  vAlign: (_?: string | number | string[] | number[]) => RxElement
  value? = (_?: string | number | string[] | number[]): RxElement => { return this as RxElement; }
  valueType: (_?: string | number | string[] | number[]) => RxElement
  viewBox: (_?: string) => RxElement
  vLink: (_?: string | number | string[] | number[]) => RxElement
  vSpace: (_?: string | number | string[] | number[]) => RxElement
  wrap: (_?: string | number | string[] | number[]) => RxElement
  xmlns: (_?: string) => RxElement
  attrDefault: (_?: string | number | string[] | number[]) => RxElement
  attrFor: (_?: string | number | string[] | number[]) => RxElement
  for: (_?: string | number) => RxElement
  default: (_?: string | number) => RxElement

  // Pseudo functions
  globalStyle: (_: {[key: string]: StyleProperties}) => RxElement
  pseudoActive: (_: StyleProperties) => RxElement
  pseudoChecked: (_: StyleProperties) => RxElement
  pseudoDisabled: (_: StyleProperties) => RxElement
  pseudoEmpty: (_: StyleProperties) => RxElement
  pseudoEnabled: (_: StyleProperties) => RxElement
  pseudoFirstOfType: (_: StyleProperties) => RxElement
  pseudoFocus: (_: StyleProperties) => RxElement
  pseudoHover: (_: StyleProperties) => RxElement
  pseudoInRange: (_: StyleProperties) => RxElement
  pseudoInvalid: (_: StyleProperties) => RxElement
  pseudoLang: (_: StyleProperties) => RxElement
  pseudoLastChild: (_: StyleProperties) => RxElement
  pseudoLastOfType: (_: StyleProperties) => RxElement
  pseudoLink: (_: StyleProperties) => RxElement
  pseudoNot: (_: StyleProperties) => RxElement
  pseudoNthChild: (_: StyleProperties) => RxElement
  pseudoNthLastChild: (_: StyleProperties) => RxElement
  pseudoNthLastOfType: (_: StyleProperties) => RxElement
  pseudoNthOfType: (_: StyleProperties) => RxElement
  pseudoOnlyOfType: (_: StyleProperties) => RxElement
  pseudoOnlyChild: (_: StyleProperties) => RxElement
  pseudoOptional: (_: StyleProperties) => RxElement
  pseudoOutOfRange: (_: StyleProperties) => RxElement
  pseudoReadOnly: (_: StyleProperties) => RxElement
  pseudoReadWrite: (_: StyleProperties) => RxElement
  pseudoRequired: (_: StyleProperties) => RxElement
  pseudoRoot: (_: StyleProperties) => RxElement
  pseudoTarget: (_: StyleProperties) => RxElement
  pseudoValid: (_: StyleProperties) => RxElement
  pseudoVisited: (_: StyleProperties) => RxElement

  pseudoBefore: (_: StyleProperties) => RxElement
  pseudoAfter: (_: StyleProperties) => RxElement
  pseudoSelection: (_: StyleProperties) => RxElement
  pseudoFirstLetter: (_: StyleProperties) => RxElement
  pseudoFirstLine: (_: StyleProperties) => RxElement

  hover: (_: StyleProperties) => RxElement

  // Layout Functions
  absCenter(v?: boolean): RxElement | boolean {
    if(v) {
      if(this.$root) {
        this.$root.position('relative');
        this.position('absolute').top('50%').left('50%')
          .transform('translate(-50%, -50%)');
        this.$absCenter = v;
        return this;
      }else {
        throw new Error('absCenter: Parent attachement required before absolute property');
      }
    }
    return this.$absCenter;
  }

  absCenterRight(v?: numberType): RxElement | numberType {
    if(v) {
      if(this.$root) {
        this.$root.position('relative');
        this.position('absolute').top('50%').right(v)
          .transform('translateY(-50%)');
        this.$absCenterRight = v;
        return this;
      }else {
        throw new Error('absCenterRight: Parent attachement required before absolute property');
      }
    }
    return this.$absCenterRight;
  }

  absCenterLeft(v?: numberType): RxElement | numberType {
    if(v) {
      if(this.$root) {
        this.$root.position('relative');
        this.position('absolute').top('50%').left(v)
          .transform('translateY(-50%)');
        this.$absCenterLeft = v;
        return this;
      }else {
        throw new Error('absCenterLeft: Parent attachement required before absolute property');
      }
    }
    return this.$absCenterLeft;
  }

  absCenterTop(v?: numberType): RxElement | numberType {
    if(v) {
      if(this.$root) {
        this.$root.position('relative');
        this.position('absolute').left('50%').top(v)
          .transform('translateX(-50%)');
        this.$absCenterTop = v;
        return this;
      }else {
        throw new Error('absCenterTop: Parent attachement required before absolute property');
      }
    }
    return this.$absCenterTop;
  }

  absCenterBottom(v?: numberType): RxElement | numberType {
    if(v) {
      if(this.$root) {
        this.$root.position('relative');
        this.position('absolute').left('50%').bottom(v)
          .transform('translateX(-50%)');
        this.$absCenterBottom = v;
        return this;
      }else {
        throw new Error('absCenterBottom: Parent attachement required before absolute property');
      }
    }
    return this.$absCenterBottom;
  }

  absPosition(..._: numberType[]): RxElement | numberType[] {
    if(arguments.length > 0) {
      const v: numberType[] = arguments.length === 1 ? arguments[0] : Array.from(arguments);
      if(this.$root) {
        this.$root.position('relative');
        this.position('absolute').top(v[0]).right(v[1]).bottom(v[2])
          .left(v[3]);
        this.$absPosition = v;
        return this;
      }else {
        throw new Error('absPosition: Parent attachement required before absolute property');
      }
    }
    return this.$absPosition;
  }

  absTopRight(..._: numberType[]): RxElement | numberType[] {
    if(arguments.length > 0) {
      const v: numberType[] = arguments.length === 1 ? arguments[0] : Array.from(arguments);
      if(this.$root) {
        this.$root.position('relative');
        this.position('absolute').top(v[0]).right(v[1]);
        this.$absTopRight = v;
        return this;
      }else {
        throw new Error('absTopRight: Parent attachement required before absolute property');
      }
    }
    return this.$absTopRight;
  }

  absTopLeft(..._: numberType[]): RxElement | numberType[] {
    if(arguments.length > 0) {
      const v: numberType[] = arguments.length === 1 ? arguments[0] : Array.from(arguments);
      if(this.$root) {
        this.$root.position('relative');
        this.position('absolute').top(v[0]).left(v[1]);
        this.$absTopLeft = v;
        return this;
      }else {
        throw new Error('absTopLeft: Parent attachement required before absolute property');
      }
    }
    return this.$absTopLeft;
  }

  absBottomRight(..._: numberType[]): RxElement | numberType[] {
    if(arguments.length > 0) {
      const v: numberType[] = arguments.length === 1 ? arguments[0] : Array.from(arguments);
      if(this.$root) {
        this.$root.position('relative');
        this.position('absolute').bottom(v[0]).right(v[1]);
        this.$absBottomRight = v;
        return this;
      }else {
        throw new Error('absBottomRight: Parent attachement required before absolute property');
      }
    }
    return this.$absBottomRight;
  }

  absBottomLeft(..._: numberType[]): RxElement | numberType[] {
    if(arguments.length > 0) {
      const v: numberType[] = arguments.length === 1 ? arguments[0] : Array.from(arguments);
      if(this.$root) {
        this.$root.position('relative');
        this.position('absolute').bottom(v[0]).left(v[1]);
        this.$absBottomLeft = v;
        return this;
      }else {
        throw new Error('absBottomLeft: Parent attachement required before absolute property');
      }
    }
    return this.$absBottomLeft;
  }

  absCenterVertical(v?: boolean): RxElement | boolean {
    if(v) {
      if(this.$root) {
        this.$root.position('relative');
        this.position('absolute').top('50%').transform('translateY(-50%)');
        this.$absCenterVertical = v;
        return this;
      }else {
        throw new Error('absCenterVertical: Parent attachement required before absolute property');
      }
    }
    return this.$absCenterVertical;
  }

  absCenterHorizontal(v?: boolean): RxElement | boolean {
    if(v) {
      if(this.$root) {
        this.$root.position('relative');
        this.position('absolute').left('50%').transform('translateX(-50%)');
        this.$absCenterHorizontal = v;
        return this;
      }else {
        throw new Error('absCenterVertical: Parent attachement required before absolute property');
      }
    }
    return this.$absCenterHorizontal;
  }

  addClassName(name: string): RxElement {
    if(this.$node) {
      if(!this.$node.classList || !this.$node.classList.contains(name)) {
        this.$node.classList.add(name);
      }
    }else {
      if(!this.$className.match(name)) {
        this.$className = this.$className + ' ' + name;
      }
    }
    return this;
  }

  // animate(animation: StyleProperties & {
  //   duration?: StyleProperties['animationDuration'], timingFunction?: StyleProperties['animationTimingFunction'],
  //   fillMode?: StyleProperties['animationFillMode']
  // } | Animation, completion?: () => void): RxElement {
  //   if(type(animation) === 'object' && !(animation instanceof Animation)) {
  //     const oldFrame: any = {};
  //     this.$animation = this.$animation || {};
  //     for(let prop in animation) {
  //       if(this.$animation.hasOwnProperty(prop)) {
  //         oldFrame[prop] = this.$animation[prop];
  //       }else {
  //         oldFrame[prop] = "initial";
  //       }
  //     }
  //     const anim = new Animation();
  //     anim.keyframes([
  //       { key: 'from', frame: oldFrame },
  //       { key: 'to', frame: animation }
  //     ]).duration(animation.duration || 0.35)
  //       .timingFunction(animation.timingFunction || Animation.$.TimingFunction.EaseInOut)
  //       .fillMode(animation.fillMode || Animation.$.FillMode.Forwards);
  //     this.$animation = anim;
  //   } else {
  //     if(!animation.$fillMode) animation.$fillMode = Animation.$.FillMode.Forwards;
  //     this.$animation = animation;
  //   }
  //
  //   const styles = Parser.parseAnimation(this.$animation);
  //   for(let i = 0; i < styles.length; i++) {
  //     try {
  //       Native.$sheet.insertRule(styles[i], Native.sheet.cssRules.length - 1);
  //     }catch(e){ console.log(e); }
  //   }
  //   if(this.$node) {
  //     if(this.$animation) {
  //       this.$node.className = this.className + ' ' + this.$animation.$name;
  //       // this.className = this.className + ' ' + this.$animation.$name;
  //     }
  //   }else {
  //     this.$className = this.$className + ' ' + this.$animation.$name;
  //   }
  //   setTimeout(() => {
  //     completion && Function.prototype.call.apply(completion);
  //     const keyframe = this.$animation.$keyframes[this.$animation.$keyframes.length - 1];
  //     for(const prop in keyframe.frame) {
  //       this.$animation[prop] = keyframe.frame[prop];
  //     }
  //     // this.$node.classList.remove(this.$animation.$name);
  //     // this.className = Array.from(this.$node.classList).join(' ');
  //   }, (this.$animation.$duration||1 + this.$animation.$delay||1) * 1000);
  //   return this;
  // }
  //
  // animation(animation?: Animation) {
  //   if(animation) {
  //     if(type(animation) === 'object' && !(animation instanceof Animation)) {
  //       const oldFrame = {}, options = animation.$ || {};
  //       this.$animation = this.$animation || {};
  //       animation.$ && delete animation.$;
  //       for(let prop in animation) {
  //         if(this.$animation.hasOwnProperty(prop)) {
  //           oldFrame[prop] = this.$animation[prop];
  //         }else {
  //           oldFrame[prop] = "initial";
  //         }
  //       }
  //       const anim = new Animation();
  //       anim.keyframes([
  //         { key: 'from', frame: oldFrame },
  //         { key: 'to', frame: animation }
  //       ]).duration(options.duration || 0.35)
  //         .timingFunction(options.timingFunction || Animation.$.TimingFunction.EaseInOut)
  //         .fillMode(options.fillMode || Animation.$.FillMode.Forwards);
  //       this.$animation = anim;
  //     } else {
  //       if(!animation.$fillMode) animation.$fillMode = Animation.$.FillMode.Forwards;
  //       this.$animation = animation;
  //     }
  //     return this;
  //   }
  //   return this.$animation;
  // },
  // aspectRatio(_?: boolean): RxElement | boolean {
  //   if(arguments.length > 0) {
  //     const v = arguments.length === 1 ? arguments[0] : Array.from(arguments);
  //     this.position('relative');
  //     this.pseudoBefore({
  //       display: 'block', content: '', width: '100%',
  //       paddingTop: `(${v[1]} / ${v[0]}) * 100%`
  //     });
  //     this.pseudoFirstChild({
  //       position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
  //     });
  //     this.$aspectRatio = v;
  //     return this;
  //   }
  //   return this.$aspectRatio;
  // },
  backgroundLinearGradient(...colors: colorType[]): RxElement | colorType[] {
    if(arguments.length > 0) {
      const v: colorType[] = arguments.length === 1 ? arguments[0] : Array.from(arguments);
      this.background(`linear-gradient(${colors[0]}, ${colors[1]}, ${colors[2]})`);
      this.$backgroundLinearGradient = v;
      return this;
    }
    return this.$backgroundLinearGradient;
  }

  // childVerticalSpacing(margin?: numberType) {
  //   if(margin) {
  //     this.globalStyle({ margin: [ margin / 2, 0, margin / 2, 0] })
  //       .pseudoFirstChild({ margin: [ 0, 0, margin / 2, 0 ] })
  //       .pseudoLastChild({ margin: [ margin / 2, 0, 0, 0] });
  //     this.$childVerticalSpacing = margin;
  //     return this;
  //   }
  //   return this.$childVerticalSpacing;
  // },
  // childHorizontalSpacing: function(margin) {
  //   if(margin) {
  //     this.globalStyle({ margin: [ 0, margin / 2, 0, margin / 2] })
  //       .pseudoFirstChild({ margin: [ 0, margin / 2, 0, 0] })
  //       .pseudoLastChild({ margin: [ 0, 0, 0, margin / 2] });
  //     this.$childVerticalSpacing = margin;
  //     return this;
  //   }
  //   return this.$childHorizontalSpacing;
  // },
  // clearFix: function(v) {
  //   if(v) {
  //     this.pseudoAfter({
  //       content: '', display: 'table', clear: 'both'
  //     });
  //     this.$clearFix = v;
  //     return this;
  //   }
  //   return this.$clearFix;
  // },
  flexSpaceBetween(v?: boolean): RxElement | boolean {
    if(v) {
      this.display('flex').justifyContent('space-between');
      this.$flexSpaceBetween = v;
      return this;
    }
    return this.$flexSpaceBetween;
  }

  flexCenter(v?: boolean): RxElement | boolean {
    if(v) {
      this.display('flex').justifyContent('center').alignItems('center');
      this.$flexCenter = v;
      return this;
    }
    return this.$flexCenter;
  }

  tag(tag?: string): RxElement | string {
    if(tag !== undefined) {
      this.$tag = window.Object.assign(this.tag() || {}, tag);
      return this;
    }
    return this.$tag;
  }

  child(predicate: {[key: string]: any}): RxElement {
    const children = this.$children.filter(child => {
      const keys = window.Object.keys(predicate), check = keys.length;
      let valid = 0;
      keys.forEach(key => {
        if(predicate[key] === (<any>child)['$' + key]) {
          valid += 1;
        }
      });
      if(valid === check) return true;
    });
    return children[0];
  }

  relCenterHorizontal(v?: boolean): RxElement | boolean {
    if(v){
      this.margin(['auto', 'auto']);
      this.$relCenterHorizontal = v;
      return this;
    }
    return this.$relCenterHorizontal;
  }

  removeClassName(name?: string): RxElement {
    if(this.$node) {
      this.$node.classList.remove(name);
    }else if(this.$className.match(name)) {
      this.$className.replace(' '+name, '');
    }
    return this;
  }

  replaceTextTag(text: string, tagObject: {[key: string]: typeof $RxElement}): RxElement {
    const all = text.match(/([\${\w]+\([\w,\s]*\)})/g),
    children: ($RxElement | string)[] = [],
    p = (t: string) => {
      all.map((i, inx) => {
        const tag = i.match(/{([\w]+\()/g)[0].replace('{','').replace('(',''),
        args = i.match(/(\([\w,]+)/g).map(i => i.replace('(', ''));
        children.push(t.slice(0, t.indexOf(i)));
        children.push(new tagObject[tag](...args));
        t = t.slice(t.indexOf(i) + i.length);
        if(inx === all.length - 1) {
          if(t.length > 0) children.push(t);
        }
      });
    };
    p(text);
    this.$children = this.$children.concat(children as RxElement[]);
    return this;
  }

  respond(key: string, props: StyleProperties): RxElement {
    // Check all

    this.$responsiveness = this.$responsiveness || [];
    this.$responsiveness.push({key: key, props: props});
    return this;
  }

  size(_: numberType[] | numberType): RxElement | numberType[] | numberType {
    if(arguments.length > 0) {
      const v: numberType[] = arguments.length === 1 ? arguments[0] : Array.from(arguments);
      this.height(v[1]).width(v[0]);
      this.$size = v;
      return this;
    }
    return this.$size;
  }

  // stack(children: RxElement[], options: { margin?: numberType, vertical?: boolean, horizontal?: boolean }): RxElement {
  //   const o = options || {};
  //   for (let i = 0; i < children.length; i++) {
  //     this.addChild(children[i]);
  //   }
  //   (o.vertical)
  //     ? this.childVerticalSpacing(o.margin||0)
  //     : this.childHorizontalSpacing(o.margin||0);
  //   this.display('flex').flexDirection((o.vertical)
  //     ? 'column' : 'row');
  //   return this;
  // }

  // stackVertical(margin?: numberType): RxElement | boolean {
  //   if(margin != undefined) {
  //     this.display('flex').flexDirection('column')
  //       .globalStyle({ margin: [ margin / 2, 0, margin / 2, 0] })
  //       .pseudoFirstChild({ margin: [ 0, 0, margin / 2, 0 ] })
  //       .pseudoLastChild({ margin: [ margin / 2, 0, 0, 0 ] });
  //     this.$stackVertical = true;
  //     return this;
  //   }
  //   return this.$stackVertical;
  // }

  truncateText(v?: boolean): RxElement | boolean {
    if(v) {
      this.overflow('hidden').textOverflow('ellipsis')
        .whiteSpace('nowrap');
      this.$truncateText = v;
      return this;
    }
    return this.$truncateText;
  }
}

export class Component extends $RxElement {

  $nid: string;
  $level = 0;
  $events: {[key: string]: ((..._: any) => any)[] } = {} as any;
  $loadQueue: Function[] = [];

  constructor(...args: any[]) {
    super('component');
    this.$nid = Math.random().toString(36).substr(2, 9);
    this.$tagName = this.name;
    Native().serving = this.name + "-" + this.$nid;
    Native().components[this.name] = Native().components[this.name] || { structure: this.constructor } as any;
    Native().components[this.name][this.$nid] = { served: false, watchlist: [] } as any;
    Native().components[this.name][this.$nid].args
    = Native().components[this.name][this.$nid].args || args;
    Native().loadQueue[Native().serving] = [];

    // additional styling (default div styling)?
    this.display('block');

    return ProxifyComponent(this, this.name, this.$nid) as Component;
  }

  set state(v) {
    if(type(v) !== 'object') {
      throw new Error('Invalid state format, state must be an object');
    }
    if(!Native().components[this.name][this.$nid]){
      throw new Error('Set state: Component doesn\'t exist or has been destroy');
    }
    v.__state__ = true;
    Native().components[this.name][this.$nid].state =
      Native().components[this.name][this.$nid].state
      || Native().components[this.name].state
      || ProxifyState(v, this);
  }

  get state() {
    if(!Native().components[this.name][this.$nid]){
      throw new Error('Get state: Component doesn\'t exist or has been destroy');
    }
    return Native().components[this.name][this.$nid].state;
  }

  get route() {
    if(!Native().components[this.name][this.$nid]) {
      throw new Error('Get route: Component doesn\'t exist or has been destroy');
    }
    return Native().components[this.name][this.$nid].route;
  }

  parent() {
    return this.$root;
  }

  children() {
    return this.$children;
  }

  emit(event: string, payload: any) {
    if(this.$events.hasOwnProperty(event)) {
      for(let i = 0; i < this.$events[event].length; i++) {
        this.$events[event][i](payload);
      }
    }else {
      return false;
    }
    return this;
  }

  listen(event: string, listener: (..._: any) => any) {
    if(this.$events.hasOwnProperty(event)) {
      this.$events[event].push(listener);
    }else {
      this.$events[event] = [listener];
    }
    return this;
  }
}

export class PageComponent extends Component {
  constructor() {
    super();
  }
}

export class Button extends $RxElement {
  constructor() {
    super('button');
    this.text('Button');
  }
}

export class Container extends $RxElement {

  constructor() { super('div'); }

  host?(routes: ConfigType.Route[]) {
    if(this.$children.length > 0) {
      throw new Error('Host container must be empty!');
    }
    let check = 0, against: ConfigType.Route[];
    const current = Native().router.current;
    if(current.hosting && current.hosting.length > 0) {
      against = current.hosting;
    }else against = current.subs;
    routes.forEach((route: ConfigType.Route) => {
      check += against.some(i => i.path === route.path) ? 1 : 0;
    });
    if(check === routes.length) Native().router.host(this, routes);
    else throw new Error(`Host: You have (${routes.length - check}) unregistered routes. Please register on the config file before hosting`);
    return this;
  }
}

export class A extends $RxElement {
  constructor() { super('a'); }
}

export class Abbr extends $RxElement {
  constructor() { super('abbr'); }
}

export class Applet extends $RxElement {
  constructor() { super('applet'); }
}

export class Area extends $RxElement {
  constructor() { super('area'); }
}

export class Article extends $RxElement {
  constructor() { super('article'); }
}

export class Aside extends $RxElement {
  constructor() { super('aside'); }
}

export class Audio extends $RxElement {
  constructor() { super('audio'); }
}

export class Base extends $RxElement {
  constructor() { super('base'); }
}

export class BaseFont extends $RxElement {
  constructor() { super('basefont'); }
}

export class BDO extends $RxElement {
  constructor() { super('bdo'); }
}

export class BlockQuote extends $RxElement {
  constructor() { super('blockquote'); }
}

export class Body extends $RxElement {
  constructor() { super('body'); }
}

export class BR extends $RxElement {
  constructor() { super('br'); }
}

export class Canvas extends $RxElement {
  constructor() { super('canvas'); }
}

export class Caption extends $RxElement {
  constructor() { super('caption'); }
}

export class Code extends $RxElement {
  constructor() { super('code'); }
}

export class Col extends $RxElement {
  constructor() { super('col'); }
}

export class ColGroup extends $RxElement {
  constructor() { super('colgroup'); }
}

export class Data extends $RxElement {
  constructor() { super('data'); }
}

export class Details extends $RxElement {
  constructor() { super('details'); }
}

export class DFN extends $RxElement {
  constructor() { super('dfn'); }
}

export class Dialog extends $RxElement {
  constructor() { super('dialog'); }
}

export class DIR extends $RxElement {
  constructor() { super('dir'); }
}

export class Div extends $RxElement {
  constructor() { super('div'); }
}

export class DL extends $RxElement {
  constructor() { super('dl'); }
}

export class EM extends $RxElement {
  constructor() { super('em'); }
}

export class Embed extends $RxElement {
  constructor() { super('embed'); }
}

export class FieldSet extends $RxElement {
  constructor() { super('fieldset'); }
}

export class FigCaption extends $RxElement {
  constructor() { super('figcaption'); }
}

export class Figure extends $RxElement {
  constructor() { super('figure'); }
}

export class Font extends $RxElement {
  constructor() { super('font'); }
}

export class Footer extends $RxElement {
  constructor() { super('footer'); }
}

export class Form extends $RxElement {
  constructor() { super('form'); }
}

export class Del extends $RxElement {
  constructor() { super('del'); }
}

export class Frame extends $RxElement {
  constructor() { super('frame'); }
}

export class FrameSet extends $RxElement {
  constructor() { super('frameset'); }
}

export class H1 extends $RxElement {
  constructor() { super('h1'); }
}

export class H2 extends $RxElement {
  constructor() { super('h2'); }
}

export class H3 extends $RxElement {
  constructor() { super('h3'); }
}

export class H4 extends $RxElement {
  constructor() { super('h4'); }
}

export class H5 extends $RxElement {
  constructor() { super('h5'); }
}

export class H6 extends $RxElement {
  constructor() { super('h6'); }
}

export class Head extends $RxElement {
  constructor() { super('head'); }
}

export class Header extends $RxElement {
  constructor() { super('header'); }
}

export class HR extends $RxElement {
  constructor() { super('hr'); }
}

export class HTML extends $RxElement {
  constructor() { super('html'); }
}

export class IFrame extends $RxElement {
  constructor() { super('iframe'); }
}

export class Image extends $RxElement {
  constructor() { super('img'); }
}

export class IMG extends $RxElement {
  constructor() { super('img'); }
}

export class Input extends $RxElement {

  $model?: NativeLock;
  $value?: any;

  constructor() { super('input'); }

  model?(object: any) {
    this.$model = {
      key: Native().lock.key,
      type: Native().lock.type,
      nid: Native().lock.nid,
      className: Native().lock.className
    };
    if(!Native().shadowing) {
      const notifyWatchlist = (lock: NativeLock, value: any) => {
        const instance = Native().components[lock.className][lock.nid];
        if(instance && instance.served) {
          for(let i = 0; i < instance.watchlist.length; i++) {
            const w = instance.watchlist[i];
            if(lock.key === w.prop) {
              w.function(value);
              w.oldValue = value;
            }
          }
        }
      }
      const lock = this.$model,
      sync = () => {
        const chain = lock.key.replace(lock.className + '.', '').split('.')
        if (lock.type === 'state') {
          protoSet(Native().components[lock.className][lock.nid].state, chain, (<HTMLInputElement>this.$node).value || '');
          notifyWatchlist(lock, (<HTMLInputElement>this.$node).value);
        } else if (lock.type === 'property') {
          protoSet(Native().components[lock.className][lock.nid].instance, chain, (<HTMLInputElement>this.$node).value || '');
          notifyWatchlist(lock, (<HTMLInputElement>this.$node).value);
        }
      }
      const watcher: { object: any, prop: string, oldValue: any, function: Function } = {
        prop: Native().lock.key, oldValue: this.value(), function: (v: any) => {
          this.value(v);
        }, object: this.$model.type === 'state'
          ? Native().components[lock.className][lock.nid].state
          : Native().components[lock.className][lock.nid].instance
      }
      Native().components[lock.className][lock.nid].watchlist.push(watcher);
      this.value(object);
      this.on({
        input: () => sync()
      });
    }
    return this;
  }

  value? = (v?: string | number) => {
    if(v !== undefined) {
      if(this.$node) {
        (<any>this.$node).value = v;
        this.$value = v;
      }else this.$value = v;
      return this;
    }else return this.$value;
  }
}

export class Ins extends $RxElement {
  constructor() { super('ins'); }
}

export class IsIndex extends $RxElement {
  constructor() { super('isindex'); }
}

export class Label extends $RxElement {
  constructor() { super('label'); }
}

export class Link extends $RxElement {
  constructor() { super('a'); }
}

export class Legend extends $RxElement {
  constructor() { super('legend'); }
}

export class LI extends $RxElement {
  constructor() { super('li'); }
}

export class Main extends $RxElement {
  constructor() { super('main'); }
}

export class Map extends $RxElement {
  constructor() { super('map'); }
}

export class Mark extends $RxElement {
  constructor() { super('mark'); }
}

export class Menu extends $RxElement {
  constructor() { super('menu'); }
}

export class Meta extends $RxElement {
  constructor() { super('meta'); }
}

export class Meter extends $RxElement {
  constructor() { super('meter'); }
}

export class Nav extends $RxElement {
  constructor() { super('nav'); }
}

export class ObjectElement extends $RxElement {
  constructor() { super('object'); }
}

export class OL extends $RxElement {
  constructor() { super('ol'); }
}

export class OptGroup extends $RxElement {
  constructor() { super('optgroup'); }
}

export class Option extends $RxElement {
  constructor() { super('option'); }
}

export class Output extends $RxElement {
  constructor() { super('output'); }
}

export class P extends $RxElement {
  constructor() { super('p'); }
}

export class Param extends $RxElement {
  constructor() { super('param'); }
}

export class Path extends $RxElement {
  constructor() { super('path'); }
}

export class Pre extends $RxElement {
  constructor() { super('pre'); }
}

export class Progress extends $RxElement {
  constructor() { super('progress'); }
}

export class Q extends $RxElement {
  constructor() { super('q'); }
}

export class Script extends $RxElement {
  constructor() { super('script'); }
}

export class Section extends $RxElement {
  constructor() { super('section'); }
}

export class Select extends $RxElement {
  constructor() { super('select'); }
}

export class Slot extends $RxElement {
  constructor() { super('slot'); }
}

export class Source extends $RxElement {
  constructor() { super('source'); }
}

export class Span extends $RxElement {
  constructor() { super('span'); }
}

export class Summary extends $RxElement {
  constructor() { super('summary'); }
}

export class SVG extends $RxElement {
  constructor() {
    super('svg');
    this.xmlns('http://www.w3.org/2000/svg');
  }
}

export class Table extends $RxElement {
  constructor() { super('table'); }
}

export class TBody extends $RxElement {
  constructor() { super('tbody'); }
}

export class TD extends $RxElement {
  constructor() { super('td'); }
}

export class TextArea extends Input {
  constructor() {
    super();
    this.$tagName = 'textarea';
  }
}

export class TFoot extends $RxElement {
  constructor() { super('tfoot'); }
}

export class TH extends $RxElement {
  constructor() { super('th'); }
}

export class THead extends $RxElement {
  constructor() { super('thead'); }
}

export class Time extends $RxElement {
  constructor() { super('time'); }
}

export class TR extends $RxElement {
  constructor() { super('tr'); }
}

export class Track extends $RxElement {
  constructor() { super('track'); }
}

export class UL extends $RxElement {
  constructor() { super('ul'); }
}

export class Video extends $RxElement {
  constructor() {
    super('video');
  }
}


export class Style {

  $className: string;
  $rules: CSSStyleRule[] = [];

  constructor(props: StyleProperties) {
    this.$className = 's' + Math.random().toString(36).substr(2, 9);
    const rules = ['.' + this.$className + '{  }'];
    if(Native() && Native().sheet) {
      // createRules(this, rules);
      // Object.getOwnPropertyNames(props).forEach(i => {
      //   (<any>this)[i]((<any>props)[i]);
      // });
    }else {
      (<any>window).__native_load_queue = (<any>window).__native_load_queue || [];
      (<any>window).__native_load_queue.push(() => {
        createRules(this, rules);
        Object.getOwnPropertyNames(props).forEach(i => {
          (<any>this)[i]((<any>props)[i]);
        });
      });
    }
  }

  global(props: {[key: string]: StyleProperties}) {
    const rules: string[] = [];
    for(const key in props) {
      rules.push('.' + this.$className + ' ' + key + ' {' + Parser.parseNativeStyle(props[key]) + '} ');
    }
    if(Native() && Native().sheet) {
      // createRules(this, rules);
    }else {
      (<any>window).__native_load_queue = (<any>window).__native_load_queue || [];
      (<any>window).__native_load_queue.push(() => {
        createRules(this, rules);
      });
    }
    return this;
  }

  pseudo(props: {[key: string]: StyleProperties}) {
    const rules: string[] = [];
    for(const key in props) {
      rules.push('.' + this.$className.replace(' ', '.') + key + ' {' + Parser.parseNativeStyle(props[key]) + '} ');
    }
    if(Native() && Native().sheet) {
      // createRules(this, rules)
    }else {
      (<any>window).__native_load_queue = (<any>window).__native_load_queue || [];
      (<any>window).__native_load_queue.push(() => {
        createRules(this, rules);
      });
    }
    return this;
  }

  alignContent: (_: flexAlignment) => Style
  alignItems: (_: flexAlignmentItem) => Style
  alignSelf: (_: flexAlignmentItem) => Style
  animationDelay: (_: string | string[]) => Style
  animationDirection: (_: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | string | string[] | globalValues) => Style
  animationDuration: (_: string | string[] | globalValues) => Style
  animationFillMode: (_: 'none' | 'forwards' | 'backwards' | 'both' | string | string[] | globalValues) => Style
  animationIterationCount: (_: 'infinite' | string | string[] | globalValues) => Style
  animationName: (_: 'none' | '-specific' | 'sliding-vertically' | 'sliding' | string | string[] | globalValues) => Style
  animationPlayState: (_: 'running' | 'paused' | string | string[] | globalValues) => Style
  animationTimingFunction: (_: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'step-start' | 'step-end' |  string | string[] | globalValues) => Style
  backfaceVisibility: (_: 'visible' | 'hidden' | string | string[] | globalValues) => Style
  background: (_: string | string[] | globalValues) => Style
  backgroundAttachment: (_: 'scroll' | 'fixed' | 'local' | string | string[] | globalValues) => Style
  backgroundClip: (_: 'border-box' | 'padding-box' | 'content-box' | 'text' | string | string[] | globalValues) => Style
  backgroundColor: (_: colorType) => Style
  backgroundImage: (_: imageType) => Style
  backgroundOrigin: (_: 'border-box' | 'padding-box' | 'content-box' | string | string[] | globalValues) => Style
  backgroundPosition: (_: 'top' | 'bottom' | 'left' | 'right' | 'center' | string | number | string[] | number[] | globalValues) => Style
  backgroundPositionX: (_: 'left' | 'center' | 'right' | string | number | string[] | globalValues) => Style
  backgroundPositionY: (_: 'top' | 'center' | 'bottom' | string | number | string[] | globalValues) => Style
  backgroundRepeat: (_: 'repeat-x' | 'repeat-y' | 'repeat' | 'space' | 'round' | 'no-repeat' | string | string[] | globalValues) => Style
  backgroundSize: (_: 'cover' | 'contain' | string | number | string[] | number[] | globalValues) => Style
  border: (_: borderStyleType | borderWidthType | string | number | string[] | globalValues) => Style
  borderBottom: (_: borderStyleType | borderWidthType | string | number | string[] | globalValues) => Style
  borderBottomColor: (_: colorType) => Style
  borderBottomLeftRadius: (_: string | number | string[] | number[] | globalValues) => Style
  borderBottomRightRadius: (_: string | number | string[] | number[] | globalValues) => Style
  borderBottomStyle: (_: borderStyleType) => Style
  borderBottomWidth: (_: borderWidthType) => Style
  borderCollapse: (_: 'collapse' | 'separate' | string | globalValues) => Style
  borderColor: (_: colorType) => Style
  borderImage: (_: 'url()' | 'linear-gradient()' | string | string[] | globalValues) => Style
  borderImageOutset: (_: number | number[] | globalValues) => Style
  borderImageRepeat: (_: 'stretch' | 'repeat' | 'round' | 'space' | string | string[] | globalValues) => Style
  borderImageSlice: (_: 'fill' | string | number | string[] | number[] | globalValues) => Style
  borderImageSource: (_: imageType) => Style
  borderImageWidth: (_: 'auto' | string | number | string[] | number[] | globalValues) => Style
  borderLeft: (_: borderStyleType | borderWidthType | string | number | string[] | globalValues) => Style
  borderLeftColor: (_: colorType) => Style
  borderLeftStyle: (_: borderStyleType) => Style
  borderLeftWidth: (_: borderWidthType) => Style
  borderRadius: (_: string | number | string[] | number[] | globalValues) => Style
  borderRight: (_: borderStyleType | borderWidthType | string | number | string[] | globalValues) => Style
  borderRightColor: (_: colorType) => Style
  borderRightStyle: (_: borderStyleType) => Style
  borderRightWidth: (_: borderWidthType) => Style
  borderSpacing: (_: number | number[] | globalValues) => Style
  borderStyle: (_: borderStyleType) => Style
  borderTop: (_: borderStyleType | borderWidthType | string | number | string[] | globalValues) => Style
  borderTopColor: (_: colorType) => Style
  borderTopLeftRadius: (_: string | number | string[] | number[] | globalValues) => Style
  borderTopRightRadius: (_: string | number | string[] | number[] | globalValues) => Style
  borderTopStyle: (_: borderStyleType) => Style
  borderTopWidth: (_: borderWidthType) => Style
  borderWidth: (_: borderWidthType) => Style
  bottom: (_: spaceType) => Style
  boxDecorationBreak: (_: 'slice' | 'clone' | string | globalValues) => Style
  boxShadow: (_: 'none' | string | string[] | globalValues) => Style
  boxSizing: (_: 'border-box' | 'content-box' | globalValues) => Style
  breakAfter: (_: breakType) => Style
  breakBefore: (_: breakType) => Style
  breakInside: (_: 'auto' | 'avoid' | 'avoid-page' | 'avoid-column' | 'avoid-region' | globalValues) => Style
  captionSide: (_: 'top' | 'bottom' | 'left' | 'right' | 'top-outside' | 'bottom-outside' | globalValues) => Style
  caretColor: (_: 'auto' | colorType) => Style
  clear: (_: 'none' | 'left' | 'right' | 'both' | 'inline-start' | 'inline-end' | globalValues) => Style
  clip: (_: 'rect()' | 'auto' | string | globalValues) => Style
  color: (_: colorType) => Style
  columnCount: (_: 'auto' | string | number | globalValues) => Style
  columnFill: (_: 'auto' | 'balance' | 'balance-all' | globalValues) => Style
  columnGap: (_: 'normal' | string | number | globalValues) => Style
  columnRule: (_: borderStyleType | borderWidthType | string | number | number[]) => Style
  columnRuleColor: (_: colorType) => Style
  columnRuleStyle: (_: borderStyleType) => Style
  columnRuleWidth: (_: borderWidthType) => Style
  columnSpan: (_: 'none' | 'all' | globalValues) => Style
  columnWidth: (_: 'auto' | string | number | globalValues) => Style
  columns: (_: 'auto' | string | number | string[] | globalValues) => Style
  content: (_:  'none' | 'normal' | 'attr()' | 'open-quote | close-quote' | 'no-open-quote | no-close-quote' | string | string[] | globalValues) => Style
  counterIncrement: (_: 'none' | string | number | string[] | globalValues) => Style
  counterReset: (_: 'none' | string | number | string[] | globalValues) => Style
  counterSet: (_: 'none' | string | number | string[] | globalValues) => Style
  cursor: (_: 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' |
    'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'grab' | 'grabbing' | 'all-scroll' | 'col-resize' | 'row-resize' | 'n-resize' | 'e-resize' |
    's-resize' | 'w-resize' | 'ne-resize' | 'nw-resize' | 'se-resize' | 'sw-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' |
    'zoom-in' | 'zoom-out' | 'url()' | string | globalValues) => Style
  direction: (_: 'ltr' | 'rtl' | globalValues) => Style
  display: (_: 'block' | 'inline' | 'run-in' | 'flow' | 'flow-root' | 'table' | 'flex' | 'grid' | 'ruby' | 'list-item' | 'table-row-group' | 'table-header-group' |
    'table-footer-group' | 'table-row' | 'table-cell' | 'table-column-group' | 'table-column' | 'table-caption' | 'ruby-base' | 'ruby-text' | 'ruby-base-container' |
    'ruby-text-container' | 'contents' | 'none' | 'inline-block' | 'inline-list-item' | 'inline-table' | 'inline-flex' | 'inline-grid' | string | string[] | globalValues) => Style
  emptyCells: (_: 'show' | 'hide' | globalValues) => Style
  filter: (_: 'url()' | 'blur()' | 'brightness()' | 'contrast()' | 'drop-shadow()' | 'grayscale()' | 'hue-rotate()' | 'invert()' | 'opacity()' | 'saturate()' |
    'sepia()' | 'none' | string | globalValues) => Style
  flex: (_: 'auto' | 'inital' | 'none' | string | number | number[] | globalValues) => Style
  flexBasis: (_: 'fill' | 'max-content' | 'min-content' | 'fit-content' | 'content' | string | number | globalValues) => Style
  flexDirection: (_: 'row' | 'row-reverse' | 'column' | 'column-reverse' | globalValues) => Style
  flexFlow: (_: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'nowrap' | 'wrap' | 'wrap-reverse' | string | string[] | globalValues) => Style
  flexGrow: (_: string | globalValues) => Style
  flexShrink: (_: string | globalValues) => Style
  flexWrap: (_: 'nowrap' | 'wrap' | 'wrap-reverse' | globalValues) => Style
  float: (_: 'left' | 'right' | 'none' | 'inline-start' | 'inline-end' | globalValues) => Style
  font: (_: 'caption' | 'icon' | 'menu' | 'message-box' | 'small-caption' | 'status-bar' | StyleProperties['fontFamily'] | StyleProperties['fontSize'] | StyleProperties['fontStretch'] |
    StyleProperties['fontStyle'] | StyleProperties['fontVariant'] | StyleProperties['fontWeight'] | StyleProperties['lineHeight']| string | string[] | globalValues) => Style
  fontFamily: (_: 'serif' | 'sans-serif' | 'monospace' | 'cursive' | 'fantasy' | 'system-ui' | 'ui-serif' | 'ui-sans-serif' | 'ui-monospace' | 'ui-rounded' | 'emoji' | 'math' | 'fangsong' | string | string[] | globalValues) => Style
  fontFeatureSettings: (_: 'normal' | 'smcp' | 'swsh' | string | globalValues) => Style
  fontKerning: (_: 'auto' | 'normal' | 'none') => Style
  fontLanguageOverride: (_: 'normal' | string | globalValues) => Style
  fontSize: (_: 'xx-small' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'xx-large' | 'xxx-large' | 'smaller' | 'larger' | string | number | globalValues) => Style
  fontSizeAdjust: (_: 'none' | string | globalValues) => Style
  fontSmooth: (_: 'auto' | 'never' | 'always' | number | string | StyleProperties['fontSize']) => Style
  fontStretch: (_: 'ultra-condensed' | 'extra-condensed' | 'condensed' | 'semi-condensed' | 'normal' | 'semi-expanded' | 'expanded' | 'extra-expanded' | 'ultra-expanded' | string | globalValues) => Style
  fontStyle: (_: 'normal' | 'italic' | 'oblique' | string | string[]) => Style
  fontSynthesis: (_: 'none' | StyleProperties['fontWeight'] | StyleProperties['fontStyle'] | string) => Style
  fontVariant: (_: 'common-ligatures' | 'no-common-ligatures' | 'discretionary-ligatures' | 'no-discretionary-ligatures' | 'historical-ligatures' | 'no-historical-ligatures' | 'contextual' | 'no-contextual' |
    'stylistic()' | 'historical-forms' | 'styleset()' | 'character-variant()' | 'swash()' | 'ornaments()' | 'annotation()' | 'small-caps' | 'all-small-caps' | 'petite-caps' | 'all-petite-caps' | 'unicase' |
    'titling-caps' | 'lining-nums' | 'oldstyle-nums' | 'diagonal-fractions' | 'stacked-fractions' | 'ordinal' | 'slashed-zero' | 'jis78' | 'jis83' | 'jis90' | 'jis04' | 'simplified' | 'traditional' |
    'full-width' | 'proportional-width' | 'ruby' | string) => Style
  fontVariantAlternates: (_: 'normal' | 'historical-forms' | 'stylistic()' | 'styleset()' | 'character-variant()' | 'swash()' | 'ornaments()' | 'annotation()' | string | globalValues) => Style
  fontVariantCaps: (_: 'normal' | 'small-caps' | 'all-small-caps' | 'petite-caps' | 'all-petite-caps' | 'unicase' | 'titling-caps' | globalValues) => Style
  fontVariantEastAsian: (_: 'normal' | 'jis78' | 'jis83' | 'jis90' | 'jis04' | 'simplified' | 'traditional' | 'full-width' | 'proportional-width' | 'ruby' | string | globalValues) => Style
  fontVariantLigatures: (_: 'normal' | 'none' | 'common-ligatures' | 'no-common-ligatures' | 'discretionary-ligatures' | 'no-discretionary-ligatures' | 'historical-ligatures' |
    'no-historical-ligatures' | 'contextual' | 'no-contextual' | globalValues) => Style
  fontVariantNumeric: (_: 'lining-nums' | 'oldstyle-nums' | 'diagonal-fractions' | 'stacked-fractions' | 'ordinal' | 'slashed-zero' | string | globalValues) => Style
  fontVariantPosition: (_: 'normal' | 'sub' | 'super' | globalValues) => Style
  fontWeight: (_: 'normal' | 'bold' | 'lighter' | 'bolder' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | globalValues) => Style
  gap: (_: number | number[] | string | string[] | globalValues) => Style
  grid: (_: StyleProperties['gridTemplate'] | StyleProperties['gridTemplateRows'] | StyleProperties['gridAutoFlow'] | StyleProperties['gridAutoColumns'] | StyleProperties['gridTemplateAreas'] |
    StyleProperties['gridColumnGap'] | string | globalValues) => Style
  gridArea: (_: 'auto' | 'span' | string | globalValues) => Style
  gridAutoColumns: (_: 'auto' | 'max-content' | 'min-content' | 'minmax()' | 'fit-content()' | string | number | globalValues) => Style
  gridAutoFlow: (_: 'row' | 'column' | 'dense' | 'row dense' | 'column desne' | globalValues) => Style
  gridColumn: (_: StyleProperties['gridArea']) => Style
  gridColumnEnd: (_: StyleProperties['gridArea']) => Style
  gridColumnGap: (_: StyleProperties['columnGap']) => Style
  gridColumnStart: (_: StyleProperties['gridArea']) => Style
  gridGap: (_: numberType | number[]) => Style
  gridRow: (_: numberType | number[]) => Style
  gridRowEnd: (_: StyleProperties['gridArea']) => Style
  gridRowStart: (_: StyleProperties['gridArea']) => Style
  gridTemplate: (_: 'none' | string | globalValues) => Style
  gridTemplateAreas: (_: StyleProperties['gridTemplate']) => Style
  gridTemplateColumns: (_: 'subgrid' | 'masonry' | 'minmax()' | 'fit-content()' | 'repeat()' | string | StyleProperties['gridTemplate']) => Style
  gridTemplateRows: (_: StyleProperties['gridTemplateColumns']) => Style
  hangingPunctuation: (_: 'none' | 'first' | 'last' | 'force-end' | 'allow-end' | string | string[] | globalValues) => Style
  height: (_: numberType) => Style
  hyphens: (_: 'none' | 'manual' | 'auto' | globalValues) => Style
  isolation: (_: 'auto' | 'isolate' | globalValues) => Style
  inset: (_: 'auto' | string | number | string[] | number[] | globalValues) => Style
  insetBottom: (_: StyleProperties['inset']) => Style
  insetLeft: (_: StyleProperties['inset']) => Style
  insetRight: (_: StyleProperties['inset']) => Style
  insetTop: (_: StyleProperties['inset']) => Style
  justifyContent: (_: 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'left' | 'right' | flexAlignment | 'safe center' | 'unsafe center' | globalValues) => Style
  justifySelf: (_: flexAlignmentItem | flexAlignment) => Style
  justifyItems: (_: flexAlignment | flexAlignmentItem | 'legacy right' | 'legacy left' | 'legacy center' | globalValues) => Style
  left: (_: numberType) => Style
  letterSpacing: (_: numberType) => Style
  lineBreak: (_: 'auto' | 'loose' | 'normal' | 'strict' | 'anywhere' | globalValues) => Style
  lineHeight: (_: numberType) => Style
  listStyle: (_: StyleProperties['listStyleType'] | StyleProperties['listStyleImage'] | StyleProperties['listStylePosition']) => Style
  listStyleImage: (_: 'none' | 'url()' | globalValues) => Style
  listStylePosition: (_: 'inside' | 'outside' | globalValues) => Style
  listStyleType: (_: 'none' | 'disc' | 'circle' | 'square' | 'decimal' | 'georgian' | 'trad-chinese-informal' | 'kannada' | '-' | '@<<custom>>' | globalValues) => Style
  margin: (_: numberType | string | number | string[] | number[]) => Style
  marginBottom: (_: numberType | string | number) => Style
  marginLeft: (_: StyleProperties['marginBottom']) => Style
  marginRight: (_: StyleProperties['marginBottom']) => Style
  marginTop: (_: StyleProperties['marginBottom']) => Style
  maxHeight: (_: 'none' | 'max-content' | 'min-content' | 'fit-content()' | numberType) => Style
  maxWidth: (_: StyleProperties['maxHeight']) => Style
  minHeight: (_: StyleProperties['maxHeight']) => Style
  minWidth: (_: StyleProperties['maxHeight']) => Style
  mixBlendMode: (_: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' |
    'exclusion' | 'hue' | 'saturation' | 'color' | 'liminosity' | globalValues) => Style
  objectFit: (_: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down') => Style
  objectPosition: (_: 'top' | 'left' | 'right' | 'bottom' | string | number | string[] | number[] | globalValues) => Style
  opacity: (_: string | globalValues) => Style
  order: (_: string | globalValues) => Style
  orphans: (_: string | globalValues) => Style
  outline: (_: StyleProperties['outlineColor'] | StyleProperties['outlineStyle'] | StyleProperties['outlineWidth']) => Style
  outlineColor: (_: colorType | 'invert') => Style
  outlineOffset: (_: string | number | globalValues) => Style
  outlineStyle: (_: borderStyleType) => Style
  outlineWidth: (_: borderWidthType) => Style
  overflow: (_: StyleProperties['overflowX'] | StyleProperties['overflowY']) => Style
  overflowBlock: (_: 'visible' | 'hidden' | 'scroll' | 'auto' | globalValues) => Style
  overflowHidden: (_: StyleProperties['overflowBlock']) => Style
  overflowWrap: (_: 'normal' | 'break-word' | 'anywhere' | globalValues) => Style
  overflowX: (_: 'clip' | StyleProperties['overflowBlock']) => Style
  overflowY: (_: 'clip' | StyleProperties['overflowBlock']) => Style
  padding: (_: numberType | string | number | string[] | number[] | globalValues) => Style
  paddingBottom: (_: numberType) => Style
  paddingLeft: (_: numberType) => Style
  paddingRight: (_: numberType) => Style
  paddingTop: (_: numberType) => Style
  pageBreakAfter: (_: 'auto' | 'always' | 'avoid' | 'left' | 'right' | 'recto' | 'verso' | globalValues) => Style
  pageBreakBefore: (_: StyleProperties['pageBreakAfter']) => Style
  pageBreakInside: (_: 'auto' | 'avoid' | globalValues) => Style
  perspective: (_: 'none' | numberType) => Style
  perspectiveOrigin: (_: 'center' | 'top' | 'bottom' | 'right' | string | globalValues) => Style
  pointerEvents: (_: 'auto' | 'none' | 'visiblePainted' | 'visibleFill' | 'visibleStroke' | 'visible' | 'painted' | 'fill' | 'stroke' | 'all' | globalValues) => Style
  position: (_: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky') => Style
  quotes: (_: 'none' | 'initial' | 'auto' | string | globalValues) => Style
  resize: (_: 'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline' | globalValues) => Style
  right: (_: numberType) => Style
  scrollBehavior: (_: 'auto' | 'smooth' | globalValues) => Style
  tabSize: (_: numberType) => Style
  tableLayout: (_: 'auto' | 'fixed' | globalValues) => Style
  textAlign: (_: 'left' | 'right' | 'center' | 'justify' | 'justify-all' | 'start' | 'end' | 'match-parent' | string | globalValues) => Style
  textAlignLast: (_: 'auto' | 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | string | globalValues) => Style
  textCombineUpright: (_: 'none' | 'all' | 'digits' | globalValues) => Style
  textDecoration: (_: StyleProperties['textDecorationLine'] | StyleProperties['textDecorationColor'] | StyleProperties['textDecorationStyle'] |
    StyleProperties['textDecorationThickness']) => Style
  textDecorationColor: (_: colorType) => Style
  textDecorationLine: (_: 'none' | 'underline' | 'overline' | 'line-through' | 'blink' | string | globalValues) => Style
  textDecorationStyle: (_: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | globalValues ) => Style
  textDecorationThickness: (_: 'auto' | 'from-font' | number | string | globalValues) => Style
  textIndent: (_: 'each-line' | 'hanging' | number | string | globalValues) => Style
  textJustify: (_: 'none' | 'auto' | 'inter-word' | 'inter-character' | 'distribute') => Style
  textOrientation: (_: 'mixed' | 'upright' | 'sideways-right' | 'sideways' | 'use-glyph-orientation' | globalValues) => Style
  textOverflow: (_: 'clip' | 'ellipsis' | '-' | globalValues) => Style
  textShadow: (_: StyleProperties['boxShadow']) => Style
  textTransform: (_: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width' | 'full-size-kana' | globalValues) => Style
  textUnderlinePosition: (_: 'auto' | 'under' | 'left' | 'right' | string | globalValues) => Style
  top: (_: numberType) => Style
  transform: (_: 'none' | 'matrix()' | 'matrix3d()' | 'perspective()' | 'rotate()' | 'rotate3d()' | 'rotateX()' | 'rotateY()' | 'rotateZ()' | 'translate()' |
    'translate3d()' | 'translateX()' | 'translateY()' | 'translateZ()' | 'scale()' | 'scale3d()' | 'scaleX()' | 'scaleY()' | 'scaleZ()' | 'skew()' |
    'skewX()' | 'skewY()' | string | globalValues) => Style
  transformOrigin: (_: 'center' | 'top' | 'right' | 'left' | 'bottom' | string | number | string[] | number[]) => Style
  transformStyle: (_: 'flat' | 'preserve-3d' | globalValues) => Style
  transition: (_: StyleProperties['transitionDelay'] | StyleProperties['transitionDuration'] | StyleProperties['transitionProperty'] | StyleProperties['transitionTimingFunction']) => Style
  transitionDelay: (_: string | string[] | globalValues) => Style
  transitionDuration: (_: number | string | globalValues) => Style
  transitionProperty: (_: StyleProperties['animationName']) => Style
  transitionTimingFunction: (_: StyleProperties['animationTimingFunction']) => Style
  unicodeBidi: (_: 'normal' | 'embed' | 'isolate' | 'bidi-override' | 'isolate-override' | 'plaintext' | globalValues) => Style
  userSelect: (_: 'none' | 'auto' | 'text' | 'contain' | 'all' | 'element' | globalValues) => Style
  verticalAlign: (_: 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom' | number | string | globalValues) => Style
  visibility: (_: 'visible' | 'hidden' | 'collapse' | globalValues) => Style
  whiteSpace: (_: 'normal' | 'nowrap' | 'wrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces' | globalValues) => Style
  width: (_: numberType) => Style
  wordBreak: (_: 'normal' | 'break-all' | 'keep-all' | 'break-word' | globalValues) => Style
  wordSpacing: (_: 'normal' | number | string | globalValues) => Style
  wordWrap: (_: 'normal' | 'break-word' | 'anywhere' | globalValues) => Style
  writingMode: (_: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | globalValues) => Style

  zIndex: (_: string | globalValues) => Style
  // custom specials
  cornerRadius: (_: StyleProperties['borderRadius']) => Style

  // Pseudo functions
  globalStyle(_: {[key: string]: StyleProperties}): Style { return this }
  pseudoActive: (_: StyleProperties) => Style
  pseudoChecked: (_: StyleProperties) => Style
  pseudoDisabled: (_: StyleProperties) => Style
  pseudoEmpty: (_: StyleProperties) => Style
  pseudoEnabled: (_: StyleProperties) => Style
  pseudoFirstOfType: (_: StyleProperties) => Style
  pseudoFocus: (_: StyleProperties) => Style
  pseudoHover: (_: StyleProperties) => Style
  pseudoInRange: (_: StyleProperties) => Style
  pseudoInvalid: (_: StyleProperties) => Style
  pseudoLang: (_: StyleProperties) => Style
  pseudoLastChild: (_: StyleProperties) => Style
  pseudoLastOfType: (_: StyleProperties) => Style
  pseudoLink: (_: StyleProperties) => Style
  pseudoNot: (_: StyleProperties) => Style
  pseudoNthChild: (_: StyleProperties) => Style
  pseudoNthLastChild: (_: StyleProperties) => Style
  pseudoNthLastOfType: (_: StyleProperties) => Style
  pseudoNthOfType: (_: StyleProperties) => Style
  pseudoOnlyOfType: (_: StyleProperties) => Style
  pseudoOnlyChild: (_: StyleProperties) => Style
  pseudoOptional: (_: StyleProperties) => Style
  pseudoOutOfRange: (_: StyleProperties) => Style
  pseudoReadOnly: (_: StyleProperties) => Style
  pseudoReadWrite: (_: StyleProperties) => Style
  pseudoRequired: (_: StyleProperties) => Style
  pseudoRoot: (_: StyleProperties) => Style
  pseudoTarget: (_: StyleProperties) => Style
  pseudoValid: (_: StyleProperties) => Style
  pseudoVisited: (_: StyleProperties) => Style

  pseudoBefore = (_: StyleProperties): Style => {
    return this;
  }
  pseudoAfter: (_: StyleProperties) => Style
  pseudoSelection: (_: StyleProperties) => Style
  pseudoFirstLetter: (_: StyleProperties) => Style
  pseudoFirstLine: (_: StyleProperties) => Style

  hover: (_: StyleProperties) => Style
}
