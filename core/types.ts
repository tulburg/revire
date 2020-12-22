import {$RxElement, Component, PageComponent, Container, Style} from './components';
import NSRouter from './router';

declare global {
  var Theme: {
    globals?: {[key: string]: StyleProperties},
    colors?: {[key: string]: string},
    fonts?: {[key: string]: any},
    dimens?: {[key: string]: any},
    styles?: {[key: string]: Style}
  } & {[key: string]: any};
  var Config: {
    routes: ConfigType.Route[],
    theme?: typeof Theme
  } & {[key: string]: any};
  var Router: NSRouter
  interface String {
    watch: (_ : (v: any) => void) => void
  }
}

export namespace ConfigType {

  export interface Route {
    path: string;
    component: typeof PageComponent;
    name: string;
    subs?: Route[];
    data?: any,
    hosting?: (Route & { hostComponent?: Container })[],
  }
}

export interface NativeEventData {
  old?: $RxElement | Component;
  new?: $RxElement | Component;
  oldValue?: any;
  newValue?: any;
  key?: string;
  index?: number;
  count?: number;
}

export interface NativeLock {
  key: string;
  type: 'property' | 'state';
  nid: string;
  className: string;
}


export enum NativeEventType {
  insert = 1,
  update = 2,
  delete = 3,
  replace = 4,
  sort = 5,
  reverse = 6,
  state = 7
}

export type globalValues = 'inherit' | 'initial' | 'unset';
export type flexAlignmentItem = 'auto' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'normal' |
  'baseline' | 'first baseline' | 'last baseline' | globalValues;
export type flexAlignment = flexAlignmentItem | 'space-between' | 'space-around' | 'space-evenly' | 'stretch';
export type colorType = 'currentcolor' | 'transparent' | 'rgb()' | 'rgba()' | 'hsl()' | 'hsla()' | '#' |  string | string[] | globalValues;
export type borderStyleType = 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | globalValues;
export type borderWidthType = 'thin' | 'thick' | 'medium' | number | string | globalValues;
export type imageType = 'none' | 'url()' | 'linear-gradient()' | string | string[] | globalValues;
export type spaceType = 'auto' | number | number[] | string | string[] | globalValues;
export type breakType = 'auto' | 'avoid' | 'always' | 'all' | 'avoid-pages' | 'page' | 'left' | 'right' | 'recto' | 'verso' | 'avoid-column' | 'column' | 'avoid-region' | globalValues;
export type numberType = 'calc()' | number | string | globalValues;

export interface StyleProperties {
  alignContent?: flexAlignment;
  alignItems?: flexAlignmentItem;
  alignSelf?: flexAlignmentItem;
  animationDelay?: string | string[];
  animationDirection?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | string | string[] | globalValues;
  animationDuration?: string | string[] | globalValues;
  animationFillMode?: 'none' | 'forwards' | 'backwards' | 'both' | string | string[] | globalValues;
  animationIterationCount?: 'infinite' | string | string[] | globalValues;
  animationName?: 'none' | '-specific' | 'sliding-vertically' | 'sliding' | string | string[] | globalValues;
  animationPlayState?: 'running' | 'paused' | string | string[] | globalValues;
  animationTimingFunction?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'step-start' | 'step-end' |  string | string[] | globalValues;
  backfaceVisibility?: 'visible' | 'hidden' | string | string[] | globalValues;
  background?: string | string[] | globalValues;
  backgroundAttachment?: 'scroll' | 'fixed' | 'local' | string | string[] | globalValues;
  backgroundClip?: 'border-box' | 'padding-box' | 'content-box' | 'text' | string | string[] | globalValues;
  backgroundColor?: colorType;
  backgroundImage?: imageType;
  backgroundOrigin?: 'border-box' | 'padding-box' | 'content-box' | string | string[] | globalValues;
  backgroundPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center' | string | number | string[] | number[] | globalValues;
  backgroundPositionX?: 'left' | 'center' | 'right' | string | number | string[] | globalValues;
  backgroundPositionY?: 'top' | 'center' | 'bottom' | string | number | string[] | globalValues;
  backgroundRepeat?: 'repeat-x' | 'repeat-y' | 'repeat' | 'space' | 'round' | 'no-repeat' | string | string[] | globalValues;
  backgroundSize?: 'cover' | 'contain' | string | number | string[] | number[] | globalValues;
  border?: borderStyleType | borderWidthType | string | number | string[] | globalValues;
  borderBottom?: borderStyleType | borderWidthType | string | number | string[] | globalValues;
  borderBottomColor?: colorType;
  borderBottomLeftRadius?: string | number | string[] | number[] | globalValues;
  borderBottomRightRadius?: string | number | string[] | number[] | globalValues;
  borderBottomStyle?: borderStyleType;
  borderBottomWidth?: borderWidthType;
  borderCollapse?: 'collapse' | 'separate' | string | globalValues;
  borderColor?: colorType;
  borderImage?: 'url()' | 'linear-gradient()' | string | string[] | globalValues;
  borderImageOutset?: number | number[] | globalValues;
  borderImageRepeat?: 'stretch' | 'repeat' | 'round' | 'space' | string | string[] | globalValues;
  borderImageSlice?: 'fill' | string | number | string[] | number[] | globalValues;
  borderImageSource?: imageType;
  borderImageWidth?: 'auto' | string | number | string[] | number[] | globalValues;
  borderLeft?: borderStyleType | borderWidthType | string | number | string[] | globalValues;
  borderLeftColor?: colorType;
  borderLeftStyle?: borderStyleType;
  borderLeftWidth?: borderWidthType;
  borderRadius?: string | number | string[] | number[] | globalValues;
  borderRight?: borderStyleType | borderWidthType | string | number | string[] | globalValues;
  borderRightColor?: colorType;
  borderRightStyle?: borderStyleType;
  borderRightWidth?: borderWidthType;
  borderSpacing?: number | number[] | globalValues;
  borderStyle?: borderStyleType;
  borderTop?: borderStyleType | borderWidthType | string | number | string[] | globalValues;
  borderTopColor?: colorType;
  borderTopLeftRadius?: string | number | string[] | number[] | globalValues
  borderTopRightRadius?: string | number | string[] | number[] | globalValues;
  borderTopStyle?: borderStyleType;
  borderTopWidth?: borderWidthType;
  borderWidth?: borderWidthType;
  bottom?: spaceType;
  boxDecorationBreak?: 'slice' | 'clone' | string | globalValues;
  boxShadow?: 'none' | string | string[] | globalValues;
  boxSizing?: 'border-box' | 'content-box' | globalValues;
  breakAfter?: breakType;
  breakBefore?: breakType;
  breakInside?: 'auto' | 'avoid' | 'avoid-page' | 'avoid-column' | 'avoid-region' | globalValues;
  captionSide?: 'top' | 'bottom' | 'left' | 'right' | 'top-outside' | 'bottom-outside' | globalValues;
  caretColor?: 'auto' | colorType;
  clear?: 'none' | 'left' | 'right' | 'both' | 'inline-start' | 'inline-end' | globalValues;
  clip?: 'rect()' | 'auto' | string | globalValues;
  color?: colorType;
  columnCount?: 'auto' | string | number | globalValues;
  columnFill?: 'auto' | 'balance' | 'balance-all' | globalValues;
  columnGap?: 'normal' | string | number | globalValues;
  columnRule?: borderStyleType | borderWidthType | string | number | number[];
  columnRuleColor?: colorType;
  columnRuleStyle?: borderStyleType;
  columnRuleWidth?: borderWidthType;
  columnSpan?: 'none' | 'all' | globalValues;
  columnWidth?: 'auto' | string | number | globalValues;
  columns?: 'auto' | string | number | string[] | globalValues;
  content?:  'none' | 'normal' | 'attr()' | 'open-quote | close-quote' | 'no-open-quote | no-close-quote' | string | string[] | globalValues;
  counterIncrement?: 'none' | string | number | string[] | globalValues;
  counterReset?: 'none' | string | number | string[] | globalValues;
  counterSet?: 'none' | string | number | string[] | globalValues;
  cursor?: 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' |
    'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'grab' | 'grabbing' | 'all-scroll' | 'col-resize' | 'row-resize' | 'n-resize' | 'e-resize' |
    's-resize' | 'w-resize' | 'ne-resize' | 'nw-resize' | 'se-resize' | 'sw-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' |
    'zoom-in' | 'zoom-out' | 'url()' | string | globalValues;
  direction?: 'ltr' | 'rtl' | globalValues;
  display?: 'block' | 'inline' | 'run-in' | 'flow' | 'flow-root' | 'table' | 'flex' | 'grid' | 'ruby' | 'list-item' | 'table-row-group' | 'table-header-group' |
    'table-footer-group' | 'table-row' | 'table-cell' | 'table-column-group' | 'table-column' | 'table-caption' | 'ruby-base' | 'ruby-text' | 'ruby-base-container' |
    'ruby-text-container' | 'contents' | 'none' | 'inline-block' | 'inline-list-item' | 'inline-table' | 'inline-flex' | 'inline-grid' | string | string[] | globalValues;
  emptyCells?: 'show' | 'hide' | globalValues;
  filter?: 'url()' | 'blur()' | 'brightness()' | 'contrast()' | 'drop-shadow()' | 'grayscale()' | 'hue-rotate()' | 'invert()' | 'opacity()' | 'saturate()' |
    'sepia()' | 'none' | string | globalValues;
  flex?: 'auto' | 'inital' | 'none' | string | number | number[] | globalValues;
  flexBasis?: 'fill' | 'max-content' | 'min-content' | 'fit-content' | 'content' | string | number | globalValues;
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | globalValues;
  flexFlow?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'nowrap' | 'wrap' | 'wrap-reverse' | string | string[] | globalValues;
  flexGrow?: string | globalValues;
  flexShrink?: string | globalValues;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse' | globalValues;
  float?: 'left' | 'right' | 'none' | 'inline-start' | 'inline-end' | globalValues;
  font?: 'caption' | 'icon' | 'menu' | 'message-box' | 'small-caption' | 'status-bar' | StyleProperties['fontFamily'] | StyleProperties['fontSize'] | StyleProperties['fontStretch'] |
    StyleProperties['fontStyle'] | StyleProperties['fontVariant'] | StyleProperties['fontWeight'] | StyleProperties['lineHeight']| string | string[] | globalValues;
  fontFamily?: 'serif' | 'sans-serif' | 'monospace' | 'cursive' | 'fantasy' | 'system-ui' | 'ui-serif' | 'ui-sans-serif' | 'ui-monospace' | 'ui-rounded' | 'emoji' | 'math' | 'fangsong' | string | string[] | globalValues;
  fontFeatureSettings?: 'normal' | 'smcp' | 'swsh' | string | globalValues;
  fontKerning?: 'auto' | 'normal' | 'none';
  fontLanguageOverride?: 'normal' | string | globalValues;
  fontSize?: 'xx-small' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'xx-large' | 'xxx-large' | 'smaller' | 'larger' | string | number | globalValues;
  fontSizeAdjust?: 'none' | string | globalValues;
  fontSmooth?: 'auto' | 'never' | 'always' | number | string | StyleProperties['fontSize'];
  fontStretch?: 'ultra-condensed' | 'extra-condensed' | 'condensed' | 'semi-condensed' | 'normal' | 'semi-expanded' | 'expanded' | 'extra-expanded' | 'ultra-expanded' | string | globalValues;
  fontStyle?: 'normal' | 'italic' | 'oblique' | string | string[];
  fontSynthesis?: 'none' | StyleProperties['fontWeight'] | StyleProperties['fontStyle'] | string;
  fontVariant?: 'common-ligatures' | 'no-common-ligatures' | 'discretionary-ligatures' | 'no-discretionary-ligatures' | 'historical-ligatures' | 'no-historical-ligatures' | 'contextual' | 'no-contextual' |
    'stylistic()' | 'historical-forms' | 'styleset()' | 'character-variant()' | 'swash()' | 'ornaments()' | 'annotation()' | 'small-caps' | 'all-small-caps' | 'petite-caps' | 'all-petite-caps' | 'unicase' |
    'titling-caps' | 'lining-nums' | 'oldstyle-nums' | 'diagonal-fractions' | 'stacked-fractions' | 'ordinal' | 'slashed-zero' | 'jis78' | 'jis83' | 'jis90' | 'jis04' | 'simplified' | 'traditional' |
    'full-width' | 'proportional-width' | 'ruby' | string;
  fontVariantAlternates?: 'normal' | 'historical-forms' | 'stylistic()' | 'styleset()' | 'character-variant()' | 'swash()' | 'ornaments()' | 'annotation()' | string | globalValues;
  fontVariantCaps?: 'normal' | 'small-caps' | 'all-small-caps' | 'petite-caps' | 'all-petite-caps' | 'unicase' | 'titling-caps' | globalValues;
  fontVariantEastAsian?: 'normal' | 'jis78' | 'jis83' | 'jis90' | 'jis04' | 'simplified' | 'traditional' | 'full-width' | 'proportional-width' | 'ruby' | string | globalValues;
  fontVariantLigatures?: 'normal' | 'none' | 'common-ligatures' | 'no-common-ligatures' | 'discretionary-ligatures' | 'no-discretionary-ligatures' | 'historical-ligatures' |
    'no-historical-ligatures' | 'contextual' | 'no-contextual' | globalValues;
  fontVariantNumeric?: 'lining-nums' | 'oldstyle-nums' | 'diagonal-fractions' | 'stacked-fractions' | 'ordinal' | 'slashed-zero' | string | globalValues;
  fontVariantPosition?: 'normal' | 'sub' | 'super' | globalValues;
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | globalValues;
  gap?: number | number[] | string | string[] | globalValues;
  grid?: StyleProperties['gridTemplate'] | StyleProperties['gridTemplateRows'] | StyleProperties['gridAutoFlow'] | StyleProperties['gridAutoColumns'] | StyleProperties['gridTemplateAreas'] |
    StyleProperties['gridColumnGap'] | string | globalValues;
  gridArea?: 'auto' | 'span' | string | globalValues;
  gridAutoColumns?: 'auto' | 'max-content' | 'min-content' | 'minmax()' | 'fit-content()' | string | number | globalValues;
  gridAutoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column desne' | globalValues;
  gridColumn?: StyleProperties['gridArea'];
  gridColumnEnd?: StyleProperties['gridArea'];
  gridColumnGap?: StyleProperties['columnGap'];
  gridColumnStart?: StyleProperties['gridArea'];
  gridGap?: numberType | number[];
  gridRow?: numberType | number[];
  gridRowEnd?: StyleProperties['gridArea'];
  gridRowStart?: StyleProperties['gridArea'];
  gridTemplate?: 'none' | string | globalValues;
  gridTemplateAreas?: StyleProperties['gridTemplate'];
  gridTemplateColumns?: 'subgrid' | 'masonry' | 'minmax()' | 'fit-content()' | 'repeat()' | string | StyleProperties['gridTemplate'];
  gridTemplateRows?: StyleProperties['gridTemplateColumns'];
  hangingPunctuation?: 'none' | 'first' | 'last' | 'force-end' | 'allow-end' | string | string[] | globalValues;
  height?: numberType;
  hyphens?: 'none' | 'manual' | 'auto' | globalValues;
  isolation?: 'auto' | 'isolate' | globalValues
  inset?: 'auto' | string | number | string[] | number[] | globalValues;
  insetBottom?: StyleProperties['inset'];
  insetLeft?: StyleProperties['inset'];
  insetRight?: StyleProperties['inset'];
  insetTop?: StyleProperties['inset'];
  justifyContent?: 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'left' | 'right' | flexAlignment | 'safe center' | 'unsafe center' | globalValues;
  justifySelf?: flexAlignmentItem | flexAlignment
  justifyItems?: flexAlignment | flexAlignmentItem | 'legacy right' | 'legacy left' | 'legacy center' | globalValues;
  left?: numberType;
  letterSpacing?: numberType;
  lineBreak?: 'auto' | 'loose' | 'normal' | 'strict' | 'anywhere' | globalValues;
  lineHeight?: numberType;
  listStyle?: StyleProperties['listStyleType'] | StyleProperties['listStyleImage'] | StyleProperties['listStylePosition'];
  listStyleImage?: 'none' | 'url()' | globalValues;
  listStylePosition?: 'inside' | 'outside' | globalValues;
  listStyleType?: 'none' | 'disc' | 'circle' | 'square' | 'decimal' | 'georgian' | 'trad-chinese-informal' | 'kannada' | '-' | '@<<custom>>' | globalValues;
  margin?: 'auto' | numberType | string | number | string[] | number[];
  marginBottom?: 'auto' | numberType | string | number;
  marginLeft?: StyleProperties['marginBottom']
  marginRight?: StyleProperties['marginBottom'];
  marginTop?: StyleProperties['marginBottom'];
  maxHeight?: 'none' | 'max-content' | 'min-content' | 'fit-content()' | numberType;
  maxWidth?: StyleProperties['maxHeight'];
  minHeight?: StyleProperties['maxHeight'];
  minWidth?: StyleProperties['maxHeight'];
  mixBlendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' |
    'exclusion' | 'hue' | 'saturation' | 'color' | 'liminosity' | globalValues;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  objectPosition?: 'top' | 'left' | 'right' | 'bottom' | string | number | string[] | number[] | globalValues;
  opacity?: string | globalValues;
  order?: string | globalValues;
  orphans?: string | globalValues;
  outline?: StyleProperties['outlineColor'] | StyleProperties['outlineStyle'] | StyleProperties['outlineWidth'];
  outlineColor?: colorType | 'invert';
  outlineOffset?: string | number | globalValues;
  outlineStyle?: borderStyleType;
  outlineWidth?: borderWidthType;
  overflow?: StyleProperties['overflowX'] | StyleProperties['overflowY'];
  overflowBlock?: 'visible' | 'hidden' | 'scroll' | 'auto' | globalValues;
  overflowHidden?: StyleProperties['overflowBlock'];
  overflowWrap?: 'normal' | 'break-word' | 'anywhere' | globalValues;
  overflowX?: 'clip' | StyleProperties['overflowBlock'];
  overflowY?: 'clip' | StyleProperties['overflowBlock'];
  padding?: numberType | string | number | string[] | number[] | globalValues;
  paddingBottom?: numberType;
  paddingLeft?: numberType;
  paddingRight?: numberType;
  paddingTop?: numberType;
  pageBreakAfter?: 'auto' | 'always' | 'avoid' | 'left' | 'right' | 'recto' | 'verso' | globalValues;
  pageBreakBefore?: StyleProperties['pageBreakAfter'];
  pageBreakInside?: 'auto' | 'avoid' | globalValues;
  perspective?: 'none' | numberType;
  perspectiveOrigin?: 'center' | 'top' | 'bottom' | 'right' | string | globalValues;
  pointerEvents?: 'auto' | 'none' | 'visiblePainted' | 'visibleFill' | 'visibleStroke' | 'visible' | 'painted' | 'fill' | 'stroke' | 'all' | globalValues;
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  quotes?: 'none' | 'initial' | 'auto' | string | globalValues;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline' | globalValues;
  right?: numberType;
  scrollBehavior?: 'auto' | 'smooth' | globalValues;
  tabSize?: numberType;
  tableLayout?: 'auto' | 'fixed' | globalValues;
  textAlign?: 'left' | 'right' | 'center' | 'justify' | 'justify-all' | 'start' | 'end' | 'match-parent' | string | globalValues;
  textAlignLast?: 'auto' | 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | string | globalValues;
  textCombineUpright?: 'none' | 'all' | 'digits' | globalValues;
  textDecoration?: StyleProperties['textDecorationLine'] | StyleProperties['textDecorationColor'] | StyleProperties['textDecorationStyle'] |
    StyleProperties['textDecorationThickness'];
  textDecorationColor?: colorType;
  textDecorationLine?: 'none' | 'underline' | 'overline' | 'line-through' | 'blink' | string | globalValues;
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | globalValues ;
  textDecorationThickness?: 'auto' | 'from-font' | number | string | globalValues;
  textIndent?: 'each-line' | 'hanging' | number | string | globalValues;
  textJustify?: 'none' | 'auto' | 'inter-word' | 'inter-character' | 'distribute';
  textOrientation?: 'mixed' | 'upright' | 'sideways-right' | 'sideways' | 'use-glyph-orientation' | globalValues;
  textOverflow?: 'clip' | 'ellipsis' | '-' | globalValues;
  textShadow?: StyleProperties['boxShadow'];
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width' | 'full-size-kana' | globalValues;
  textUnderlinePosition?: 'auto' | 'under' | 'left' | 'right' | string | globalValues;
  top?: numberType;
  transform?: 'none' | 'matrix()' | 'matrix3d()' | 'perspective()' | 'rotate()' | 'rotate3d()' | 'rotateX()' | 'rotateY()' | 'rotateZ()' | 'translate()' |
    'translate3d()' | 'translateX()' | 'translateY()' | 'translateZ()' | 'scale()' | 'scale3d()' | 'scaleX()' | 'scaleY()' | 'scaleZ()' | 'skew()' |
    'skewX()' | 'skewY()' | string | globalValues;
  transformOrigin?: 'center' | 'top' | 'right' | 'left' | 'bottom' | string | number | string[] | number[];
  transformStyle?: 'flat' | 'preserve-3d' | globalValues;
  transition?: StyleProperties['transitionDelay'] | StyleProperties['transitionDuration'] | StyleProperties['transitionProperty'] | StyleProperties['transitionTimingFunction'];
  transitionDelay?: string | string[] | globalValues;
  transitionDuration?: number | string | globalValues;
  transitionProperty?: StyleProperties['animationName'];
  transitionTimingFunction?: StyleProperties['animationTimingFunction'];
  unicodeBidi?: 'normal' | 'embed' | 'isolate' | 'bidi-override' | 'isolate-override' | 'plaintext' | globalValues;
  userSelect?: 'none' | 'auto' | 'text' | 'contain' | 'all' | 'element' | globalValues;
  verticalAlign?: 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom' | number | string | globalValues;
  visibility?: 'visible' | 'hidden' | 'collapse' | globalValues;
  whiteSpace?: 'normal' | 'nowrap' | 'wrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces' | globalValues;
  width?: numberType;
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word' | globalValues;
  wordSpacing?: 'normal' | number | string | globalValues;
  wordWrap?: 'normal' | 'break-word' | 'anywhere' | globalValues;
  writingMode?: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | globalValues;

  zIndex?: string | globalValues;
  // custom specials
  cornerRadius?: StyleProperties['borderRadius'];
}

export type RxElement = {

  $nid?: string;
  state?: any;

  onCreate?: Function;
  onUpdate?: Function;

  //input model
  model?: (object: any) => RxElement

  alignContent: (value: flexAlignment) => RxElement
  alignItems: (value: flexAlignmentItem) => RxElement
  alignSelf: (value: flexAlignmentItem) => RxElement
  animationDelay: (value: string | string[]) => RxElement
  animationDirection: (value: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | string | string[] | globalValues) => RxElement
  animationDuration: (value: string | string[] | globalValues) => RxElement
  animationFillMode: (value: 'none' | 'forwards' | 'backwards' | 'both' | string | string[] | globalValues) => RxElement
  animationIterationCount: (value: 'infinite' | string | string[] | globalValues) => RxElement
  animationName: (value: 'none' | '-specific' | 'sliding-vertically' | 'sliding' | string | string[] | globalValues) => RxElement
  animationPlayState: (value: 'running' | 'paused' | string | string[] | globalValues) => RxElement
  animationTimingFunction: (value: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'step-start' | 'step-end' |  string | string[] | globalValues) => RxElement
  backfaceVisibility: (value: 'visible' | 'hidden' | string | string[] | globalValues) => RxElement
  background: (value: string | string[] | globalValues) => RxElement
  backgroundAttachment: (value: 'scroll' | 'fixed' | 'local' | string | string[] | globalValues) => RxElement
  backgroundClip: (value: 'border-box' | 'padding-box' | 'content-box' | 'text' | string | string[] | globalValues) => RxElement
  backgroundColor: (value: colorType) => RxElement
  backgroundImage: (value: imageType) => RxElement
  backgroundOrigin: (value: 'border-box' | 'padding-box' | 'content-box' | string | string[] | globalValues) => RxElement
  backgroundPosition: (value: 'top' | 'bottom' | 'left' | 'right' | 'center' | string | number | string[] | number[] | globalValues) => RxElement
  backgroundPositionX: (value: 'left' | 'center' | 'right' | string | number | string[] | globalValues) => RxElement
  backgroundPositionY: (value: 'top' | 'center' | 'bottom' | string | number | string[] | globalValues) => RxElement
  backgroundRepeat: (value: 'repeat-x' | 'repeat-y' | 'repeat' | 'space' | 'round' | 'no-repeat' | string | string[] | globalValues) => RxElement
  backgroundSize: (value: 'cover' | 'contain' | string | number | string[] | number[] | globalValues) => RxElement
  border: (value: borderStyleType | borderWidthType | string | number | string[] | globalValues) => RxElement
  borderBottom: (value: borderStyleType | borderWidthType | string | number | string[] | globalValues) => RxElement
  borderBottomColor: (value: colorType) => RxElement
  borderBottomLeftRadius: (value: string | number | string[] | number[] | globalValues) => RxElement
  borderBottomRightRadius: (value: string | number | string[] | number[] | globalValues) => RxElement
  borderBottomStyle: (value: borderStyleType) => RxElement
  borderBottomWidth: (value: borderWidthType) => RxElement
  borderCollapse: (value: 'collapse' | 'separate' | string | globalValues) => RxElement
  borderColor: (value: colorType) => RxElement
  borderImage: (value: 'url()' | 'linear-gradient()' | string | string[] | globalValues) => RxElement
  borderImageOutset: (value: number | number[] | globalValues) => RxElement
  borderImageRepeat: (value: 'stretch' | 'repeat' | 'round' | 'space' | string | string[] | globalValues) => RxElement
  borderImageSlice: (value: 'fill' | string | number | string[] | number[] | globalValues) => RxElement
  borderImageSource: (value: imageType) => RxElement
  borderImageWidth: (value: 'auto' | string | number | string[] | number[] | globalValues) => RxElement
  borderLeft: (value: borderStyleType | borderWidthType | string | number | string[] | globalValues) => RxElement
  borderLeftColor: (value: colorType) => RxElement
  borderLeftStyle: (value: borderStyleType) => RxElement
  borderLeftWidth: (value: borderWidthType) => RxElement
  borderRadius: (value: string | number | string[] | number[] | globalValues) => RxElement
  borderRight: (value: borderStyleType | borderWidthType | string | number | string[] | globalValues) => RxElement
  borderRightColor: (value: colorType) => RxElement
  borderRightStyle: (value: borderStyleType) => RxElement
  borderRightWidth: (value: borderWidthType) => RxElement
  borderSpacing: (value: number | number[] | globalValues) => RxElement
  borderStyle: (value: borderStyleType) => RxElement
  borderTop: (value: borderStyleType | borderWidthType | string | number | string[] | globalValues) => RxElement
  borderTopColor: (value: colorType) => RxElement
  borderTopLeftRadius: (value: string | number | string[] | number[] | globalValues) => RxElement
  borderTopRightRadius: (value: string | number | string[] | number[] | globalValues) => RxElement
  borderTopStyle: (value: borderStyleType) => RxElement
  borderTopWidth: (value: borderWidthType) => RxElement
  borderWidth: (value: borderWidthType) => RxElement
  bottom: (value: spaceType) => RxElement
  boxDecorationBreak: (value: 'slice' | 'clone' | string | globalValues) => RxElement
  boxShadow: (value: 'none' | string | string[] | globalValues) => RxElement
  boxSizing: (value: 'border-box' | 'content-box' | globalValues) => RxElement
  breakAfter: (value: breakType) => RxElement
  breakBefore: (value: breakType) => RxElement
  breakInside: (value: 'auto' | 'avoid' | 'avoid-page' | 'avoid-column' | 'avoid-region' | globalValues) => RxElement
  captionSide: (value: 'top' | 'bottom' | 'left' | 'right' | 'top-outside' | 'bottom-outside' | globalValues) => RxElement
  caretColor: (value: 'auto' | colorType) => RxElement
  clear: (value: 'none' | 'left' | 'right' | 'both' | 'inline-start' | 'inline-end' | globalValues) => RxElement
  clip: (value: 'rect()' | 'auto' | string | globalValues) => RxElement
  color: (value: colorType) => RxElement
  columnCount: (value: 'auto' | string | number | globalValues) => RxElement
  columnFill: (value: 'auto' | 'balance' | 'balance-all' | globalValues) => RxElement
  columnGap: (value: 'normal' | string | number | globalValues) => RxElement
  columnRule: (value: borderStyleType | borderWidthType | string | number | number[]) => RxElement
  columnRuleColor: (value: colorType) => RxElement
  columnRuleStyle: (value: borderStyleType) => RxElement
  columnRuleWidth: (value: borderWidthType) => RxElement
  columnSpan: (value: 'none' | 'all' | globalValues) => RxElement
  columnWidth: (value: 'auto' | string | number | globalValues) => RxElement
  columns: (value: 'auto' | string | number | string[] | globalValues) => RxElement
  content: (value:  'none' | 'normal' | 'attr()' | 'open-quote | close-quote' | 'no-open-quote | no-close-quote' | string | string[] | globalValues) => RxElement
  counterIncrement: (value: 'none' | string | number | string[] | globalValues) => RxElement
  counterReset: (value: 'none' | string | number | string[] | globalValues) => RxElement
  counterSet: (value: 'none' | string | number | string[] | globalValues) => RxElement
  cursor: (value: 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' |
    'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'grab' | 'grabbing' | 'all-scroll' | 'col-resize' | 'row-resize' | 'n-resize' | 'e-resize' |
    's-resize' | 'w-resize' | 'ne-resize' | 'nw-resize' | 'se-resize' | 'sw-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' |
    'zoom-in' | 'zoom-out' | 'url()' | string | globalValues) => RxElement
  direction: (value: 'ltr' | 'rtl' | globalValues) => RxElement
  display: (value: 'block' | 'inline' | 'run-in' | 'flow' | 'flow-root' | 'table' | 'flex' | 'grid' | 'ruby' | 'list-item' | 'table-row-group' | 'table-header-group' |
    'table-footer-group' | 'table-row' | 'table-cell' | 'table-column-group' | 'table-column' | 'table-caption' | 'ruby-base' | 'ruby-text' | 'ruby-base-container' |
    'ruby-text-container' | 'contents' | 'none' | 'inline-block' | 'inline-list-item' | 'inline-table' | 'inline-flex' | 'inline-grid' | string | string[] | globalValues) => RxElement
  emptyCells: (value: 'show' | 'hide' | globalValues) => RxElement
  filter: (value: 'url()' | 'blur()' | 'brightness()' | 'contrast()' | 'drop-shadow()' | 'grayscale()' | 'hue-rotate()' | 'invert()' | 'opacity()' | 'saturate()' |
    'sepia()' | 'none' | string | globalValues) => RxElement
  flex: (value: 'auto' | 'inital' | 'none' | string | number | number[] | globalValues) => RxElement
  flexBasis: (value: 'fill' | 'max-content' | 'min-content' | 'fit-content' | 'content' | string | number | globalValues) => RxElement
  flexDirection: (value: 'row' | 'row-reverse' | 'column' | 'column-reverse' | globalValues) => RxElement
  flexFlow: (value: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'nowrap' | 'wrap' | 'wrap-reverse' | string | string[] | globalValues) => RxElement
  flexGrow: (value: string | globalValues) => RxElement
  flexShrink: (value: string | globalValues) => RxElement
  flexWrap: (value: 'nowrap' | 'wrap' | 'wrap-reverse' | globalValues) => RxElement
  float: (value: 'left' | 'right' | 'none' | 'inline-start' | 'inline-end' | globalValues) => RxElement
  font: (value: 'caption' | 'icon' | 'menu' | 'message-box' | 'small-caption' | 'status-bar' | StyleProperties['fontFamily'] | StyleProperties['fontSize'] | StyleProperties['fontStretch'] |
    StyleProperties['fontStyle'] | StyleProperties['fontVariant'] | StyleProperties['fontWeight'] | StyleProperties['lineHeight']| string | string[] | globalValues) => RxElement
  fontFamily: (value: 'serif' | 'sans-serif' | 'monospace' | 'cursive' | 'fantasy' | 'system-ui' | 'ui-serif' | 'ui-sans-serif' | 'ui-monospace' | 'ui-rounded' | 'emoji' | 'math' | 'fangsong' | string | string[] | globalValues) => RxElement
  fontFeatureSettings: (value: 'normal' | 'smcp' | 'swsh' | string | globalValues) => RxElement
  fontKerning: (value: 'auto' | 'normal' | 'none') => RxElement
  fontLanguageOverride: (value: 'normal' | string | globalValues) => RxElement
  fontSize: (value: 'xx-small' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'xx-large' | 'xxx-large' | 'smaller' | 'larger' | string | number | globalValues) => RxElement
  fontSizeAdjust: (value: 'none' | string | globalValues) => RxElement
  fontSmooth: (value: 'auto' | 'never' | 'always' | number | string | StyleProperties['fontSize']) => RxElement
  fontStretch: (value: 'ultra-condensed' | 'extra-condensed' | 'condensed' | 'semi-condensed' | 'normal' | 'semi-expanded' | 'expanded' | 'extra-expanded' | 'ultra-expanded' | string | globalValues) => RxElement
  fontStyle: (value: 'normal' | 'italic' | 'oblique' | string | string[]) => RxElement
  fontSynthesis: (value: 'none' | StyleProperties['fontWeight'] | StyleProperties['fontStyle'] | string) => RxElement
  fontVariant: (value: 'common-ligatures' | 'no-common-ligatures' | 'discretionary-ligatures' | 'no-discretionary-ligatures' | 'historical-ligatures' | 'no-historical-ligatures' | 'contextual' | 'no-contextual' |
    'stylistic()' | 'historical-forms' | 'styleset()' | 'character-variant()' | 'swash()' | 'ornaments()' | 'annotation()' | 'small-caps' | 'all-small-caps' | 'petite-caps' | 'all-petite-caps' | 'unicase' |
    'titling-caps' | 'lining-nums' | 'oldstyle-nums' | 'diagonal-fractions' | 'stacked-fractions' | 'ordinal' | 'slashed-zero' | 'jis78' | 'jis83' | 'jis90' | 'jis04' | 'simplified' | 'traditional' |
    'full-width' | 'proportional-width' | 'ruby' | string) => RxElement
  fontVariantAlternates: (value: 'normal' | 'historical-forms' | 'stylistic()' | 'styleset()' | 'character-variant()' | 'swash()' | 'ornaments()' | 'annotation()' | string | globalValues) => RxElement
  fontVariantCaps: (value: 'normal' | 'small-caps' | 'all-small-caps' | 'petite-caps' | 'all-petite-caps' | 'unicase' | 'titling-caps' | globalValues) => RxElement
  fontVariantEastAsian: (value: 'normal' | 'jis78' | 'jis83' | 'jis90' | 'jis04' | 'simplified' | 'traditional' | 'full-width' | 'proportional-width' | 'ruby' | string | globalValues) => RxElement
  fontVariantLigatures: (value: 'normal' | 'none' | 'common-ligatures' | 'no-common-ligatures' | 'discretionary-ligatures' | 'no-discretionary-ligatures' | 'historical-ligatures' |
    'no-historical-ligatures' | 'contextual' | 'no-contextual' | globalValues) => RxElement
  fontVariantNumeric: (value: 'lining-nums' | 'oldstyle-nums' | 'diagonal-fractions' | 'stacked-fractions' | 'ordinal' | 'slashed-zero' | string | globalValues) => RxElement
  fontVariantPosition: (value: 'normal' | 'sub' | 'super' | globalValues) => RxElement
  fontWeight: (value: 'normal' | 'bold' | 'lighter' | 'bolder' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | globalValues) => RxElement
  gap: (value: number | number[] | string | string[] | globalValues) => RxElement
  grid: (value: StyleProperties['gridTemplate'] | StyleProperties['gridTemplateRows'] | StyleProperties['gridAutoFlow'] | StyleProperties['gridAutoColumns'] | StyleProperties['gridTemplateAreas'] |
    StyleProperties['gridColumnGap'] | string | globalValues) => RxElement
  gridArea: (value: 'auto' | 'span' | string | globalValues) => RxElement
  gridAutoColumns: (value: 'auto' | 'max-content' | 'min-content' | 'minmax()' | 'fit-content()' | string | number | globalValues) => RxElement
  gridAutoFlow: (value: 'row' | 'column' | 'dense' | 'row dense' | 'column desne' | globalValues) => RxElement
  gridColumn: (value: StyleProperties['gridArea']) => RxElement
  gridColumnEnd: (value: StyleProperties['gridArea']) => RxElement
  gridColumnGap: (value: StyleProperties['columnGap']) => RxElement
  gridColumnStart: (value: StyleProperties['gridArea']) => RxElement
  gridGap: (value: numberType | number[]) => RxElement
  gridRow: (value: numberType | number[]) => RxElement
  gridRowEnd: (value: StyleProperties['gridArea']) => RxElement
  gridRowStart: (value: StyleProperties['gridArea']) => RxElement
  gridTemplate: (value: 'none' | string | globalValues) => RxElement
  gridTemplateAreas: (value: StyleProperties['gridTemplate']) => RxElement
  gridTemplateColumns: (value: 'subgrid' | 'masonry' | 'minmax()' | 'fit-content()' | 'repeat()' | string | StyleProperties['gridTemplate']) => RxElement
  gridTemplateRows: (value: StyleProperties['gridTemplateColumns']) => RxElement
  hangingPunctuation: (value: 'none' | 'first' | 'last' | 'force-end' | 'allow-end' | string | string[] | globalValues) => RxElement
  height: (value: numberType) => RxElement
  hyphens: (value: 'none' | 'manual' | 'auto' | globalValues) => RxElement
  isolation: (value: 'auto' | 'isolate' | globalValues) => RxElement
  inset: (value: 'auto' | string | number | string[] | number[] | globalValues) => RxElement
  insetBottom: (value: StyleProperties['inset']) => RxElement
  insetLeft: (value: StyleProperties['inset']) => RxElement
  insetRight: (value: StyleProperties['inset']) => RxElement
  insetTop: (value: StyleProperties['inset']) => RxElement
  justifyContent: (value: 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'left' | 'right' | flexAlignment | 'safe center' | 'unsafe center' | globalValues) => RxElement
  justifySelf: (value: flexAlignmentItem | flexAlignment) => RxElement
  justifyItems: (value: flexAlignment | flexAlignmentItem | 'legacy right' | 'legacy left' | 'legacy center' | globalValues) => RxElement
  left: (value: numberType) => RxElement
  letterSpacing: (value: numberType) => RxElement
  lineBreak: (value: 'auto' | 'loose' | 'normal' | 'strict' | 'anywhere' | globalValues) => RxElement
  lineHeight: (value: numberType) => RxElement
  listStyle: (value: StyleProperties['listStyleType'] | StyleProperties['listStyleImage'] | StyleProperties['listStylePosition']) => RxElement
  listStyleImage: (value: 'none' | 'url()' | globalValues) => RxElement
  listStylePosition: (value: 'inside' | 'outside' | globalValues) => RxElement
  listStyleType: (value: 'none' | 'disc' | 'circle' | 'square' | 'decimal' | 'georgian' | 'trad-chinese-informal' | 'kannada' | '-' | '@<<custom>>' | globalValues) => RxElement
  margin: (value: numberType | string | number | string[] | number[]) => RxElement
  marginBottom: (value: numberType | string | number) => RxElement
  marginLeft: (value: StyleProperties['marginBottom']) => RxElement
  marginRight: (value: StyleProperties['marginBottom']) => RxElement
  marginTop: (value: StyleProperties['marginBottom']) => RxElement
  maxHeight: (value: 'none' | 'max-content' | 'min-content' | 'fit-content()' | numberType) => RxElement
  maxWidth: (value: StyleProperties['maxHeight']) => RxElement
  minHeight: (value: StyleProperties['maxHeight']) => RxElement
  minWidth: (value: StyleProperties['maxHeight']) => RxElement
  mixBlendMode: (value: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' |
    'exclusion' | 'hue' | 'saturation' | 'color' | 'liminosity' | globalValues) => RxElement
  objectFit: (value: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down') => RxElement
  objectPosition: (value: 'top' | 'left' | 'right' | 'bottom' | string | number | string[] | number[] | globalValues) => RxElement
  opacity: (value: string | globalValues) => RxElement
  order: (value: string | globalValues) => RxElement
  orphans: (value: string | globalValues) => RxElement
  outline: (value: StyleProperties['outlineColor'] | StyleProperties['outlineStyle'] | StyleProperties['outlineWidth']) => RxElement
  outlineColor: (value: colorType | 'invert') => RxElement
  outlineOffset: (value: string | number | globalValues) => RxElement
  outlineStyle: (value: borderStyleType) => RxElement
  outlineWidth: (value: borderWidthType) => RxElement
  overflow: (value: StyleProperties['overflowX'] | StyleProperties['overflowY']) => RxElement
  overflowBlock: (value: 'visible' | 'hidden' | 'scroll' | 'auto' | globalValues) => RxElement
  overflowHidden: (value: StyleProperties['overflowBlock']) => RxElement
  overflowWrap: (value: 'normal' | 'break-word' | 'anywhere' | globalValues) => RxElement
  overflowX: (value: 'clip' | StyleProperties['overflowBlock']) => RxElement
  overflowY: (value: 'clip' | StyleProperties['overflowBlock']) => RxElement
  padding: (value: numberType | string | number | string[] | number[] | globalValues) => RxElement
  paddingBottom: (value: numberType) => RxElement
  paddingLeft: (value: numberType) => RxElement
  paddingRight: (value: numberType) => RxElement
  paddingTop: (value: numberType) => RxElement
  pageBreakAfter: (value: 'auto' | 'always' | 'avoid' | 'left' | 'right' | 'recto' | 'verso' | globalValues) => RxElement
  pageBreakBefore: (value: StyleProperties['pageBreakAfter']) => RxElement
  pageBreakInside: (value: 'auto' | 'avoid' | globalValues) => RxElement
  perspective: (value: 'none' | numberType) => RxElement
  perspectiveOrigin: (value: 'center' | 'top' | 'bottom' | 'right' | string | globalValues) => RxElement
  pointerEvents: (value: 'auto' | 'none' | 'visiblePainted' | 'visibleFill' | 'visibleStroke' | 'visible' | 'painted' | 'fill' | 'stroke' | 'all' | globalValues) => RxElement
  position: (value: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky') => RxElement | any
  quotes: (value: 'none' | 'initial' | 'auto' | string | globalValues) => RxElement
  resize: (value: 'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline' | globalValues) => RxElement
  right: (value: numberType) => RxElement
  scrollBehavior: (value: 'auto' | 'smooth' | globalValues) => RxElement
  tabSize: (value: numberType) => RxElement
  tableLayout: (value: 'auto' | 'fixed' | globalValues) => RxElement
  textAlign: (value: 'left' | 'right' | 'center' | 'justify' | 'justify-all' | 'start' | 'end' | 'match-parent' | string | globalValues) => RxElement
  textAlignLast: (value: 'auto' | 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | string | globalValues) => RxElement
  textCombineUpright: (value: 'none' | 'all' | 'digits' | globalValues) => RxElement
  textDecoration: (value: StyleProperties['textDecorationLine'] | StyleProperties['textDecorationColor'] | StyleProperties['textDecorationStyle'] |
    StyleProperties['textDecorationThickness']) => RxElement
  textDecorationColor: (value: colorType) => RxElement
  textDecorationLine: (value: 'none' | 'underline' | 'overline' | 'line-through' | 'blink' | string | globalValues) => RxElement
  textDecorationStyle: (value: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | globalValues ) => RxElement
  textDecorationThickness: (value: 'auto' | 'from-font' | number | string | globalValues) => RxElement
  textIndent: (value: 'each-line' | 'hanging' | number | string | globalValues) => RxElement
  textJustify: (value: 'none' | 'auto' | 'inter-word' | 'inter-character' | 'distribute') => RxElement
  textOrientation: (value: 'mixed' | 'upright' | 'sideways-right' | 'sideways' | 'use-glyph-orientation' | globalValues) => RxElement
  textOverflow: (value: 'clip' | 'ellipsis' | '-' | globalValues) => RxElement
  textShadow: (value: StyleProperties['boxShadow']) => RxElement
  textTransform: (value: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width' | 'full-size-kana' | globalValues) => RxElement
  textUnderlinePosition: (value: 'auto' | 'under' | 'left' | 'right' | string | globalValues) => RxElement
  top: (value: numberType) => RxElement
  transform: (value: 'none' | 'matrix()' | 'matrix3d()' | 'perspective()' | 'rotate()' | 'rotate3d()' | 'rotateX()' | 'rotateY()' | 'rotateZ()' | 'translate()' |
    'translate3d()' | 'translateX()' | 'translateY()' | 'translateZ()' | 'scale()' | 'scale3d()' | 'scaleX()' | 'scaleY()' | 'scaleZ()' | 'skew()' |
    'skewX()' | 'skewY()' | string | globalValues) => RxElement
  transformOrigin: (value: 'center' | 'top' | 'right' | 'left' | 'bottom' | string | number | string[] | number[]) => RxElement
  transformStyle: (value: 'flat' | 'preserve-3d' | globalValues) => RxElement
  transition: (value: StyleProperties['transitionDelay'] | StyleProperties['transitionDuration'] | StyleProperties['transitionProperty'] | StyleProperties['transitionTimingFunction']) => RxElement
  transitionDelay: (value: string | string[] | globalValues) => RxElement
  transitionDuration: (value: number | string | globalValues) => RxElement
  transitionProperty: (value: StyleProperties['animationName']) => RxElement
  transitionTimingFunction: (value: StyleProperties['animationTimingFunction']) => RxElement
  unicodeBidi: (value: 'normal' | 'embed' | 'isolate' | 'bidi-override' | 'isolate-override' | 'plaintext' | globalValues) => RxElement
  userSelect: (value: 'none' | 'auto' | 'text' | 'contain' | 'all' | 'element' | globalValues) => RxElement
  verticalAlign: (value: 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom' | number | string | globalValues) => RxElement
  visibility: (value: 'visible' | 'hidden' | 'collapse' | globalValues) => RxElement
  whiteSpace: (value: 'normal' | 'nowrap' | 'wrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces' | globalValues) => RxElement
  width: (value: numberType) => RxElement
  wordBreak: (value: 'normal' | 'break-all' | 'keep-all' | 'break-word' | globalValues) => RxElement
  wordSpacing: (value: 'normal' | number | string | globalValues) => RxElement
  wordWrap: (value: 'normal' | 'break-word' | 'anywhere' | globalValues) => RxElement
  writingMode: (value: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | globalValues) => RxElement

  zIndex: (value: string | globalValues) => RxElement
  // custom specials
  cornerRadius: (value: StyleProperties['borderRadius']) => RxElement

  // attributes
  abbr: (value: string | number | string[] | number[]) => RxElement
  accept: (value: string) => RxElement,
  acceptCharset: (value: string | number | string[] | number[]) => RxElement
  accessKey: (value: string | number | string[] | number[]) => RxElement
  action: (value: string | number | string[] | number[]) => RxElement
  alink: (value: string | number | string[] | number[]) => RxElement
  allow: (value: string | number | string[] | number[]) => RxElement
  allowFullscreen: (value: string | number | string[] | number[]) => RxElement
  allowPaymentRequest: (value: string | number | string[] | number[]) => RxElement
  allowUserMedia: (value: string | number | string[] | number[]) => RxElement
  alt: (value: string | number | string[] | number[]) => RxElement
  archive: (value: string | number | string[] | number[]) => RxElement
  as: (value: string | number | string[] | number[]) => RxElement
  async: (value: string | number | string[] | number[]) => RxElement
  attrHeight: (value: string | number | string[] | number[]) => RxElement
  attrWidth: (value: string | number | string[] | number[]) => RxElement
  autoCapitalize: (value: string | number | string[] | number[]) => RxElement
  autoComplete: (value: string | number | string[] | number[]) => RxElement
  autoFocus: (value: string | number | string[] | number[]) => RxElement
  autoPlay: (value: string | number | string[] | number[]) => RxElement
  axis: (value: string | number | string[] | number[]) => RxElement
  capture: (value: 'user' | 'environment') => RxElement,
  cellPadding: (value: string | number | string[] | number[]) => RxElement
  cellSpacing: (value: string | number | string[] | number[]) => RxElement
  char: (value: string | number | string[] | number[]) => RxElement
  charOff: (value: string | number | string[] | number[]) => RxElement
  charset: (value: string | number | string[] | number[]) => RxElement
  checked?: (value: string | number | string[] | number[]) => RxElement | any | any[]
  cite: (value: string | number | string[] | number[]) => RxElement
  classId: (value: string | number | string[] | number[]) => RxElement
  className: (value: string | number | string[] | number[]) => RxElement
  clearAttr: (value: string | number | string[] | number[]) => RxElement
  code: (value: string | number | string[] | number[]) => RxElement
  codeBase: (value: string | number | string[] | number[]) => RxElement
  codeType: (value: string | number | string[] | number[]) => RxElement
  cols: (value: string | number | string[] | number[]) => RxElement
  colSpan: (value: string | number | string[] | number[]) => RxElement
  compact: (value: string | number | string[] | number[]) => RxElement
  contentEditable: (value: string | number | string[] | number[]) => RxElement
  controls: (value: string | number | string[] | number[]) => RxElement
  coords: (value: string | number | string[] | number[]) => RxElement
  crossOrigin: (value: string | number | string[] | number[]) => RxElement
  d: (value: string) => RxElement
  data: (value: string | number | string[] | number[]) => RxElement
  datetime: (value: string | number | string[] | number[]) => RxElement
  declare: (value: string | number | string[] | number[]) => RxElement
  decoding: (value: string | number | string[] | number[]) => RxElement
  dir: (value: string | number | string[] | number[]) => RxElement
  dirname: (value: string | number | string[] | number[]) => RxElement
  disabled: (value: string | number | string[] | number[]) => RxElement
  download: (value: string | number | string[] | number[]) => RxElement
  draggable: (value: string | number | string[] | number[]) => RxElement
  enctype: (value: string | number | string[] | number[]) => RxElement
  enterKeyHint: (value: string | number | string[] | number[]) => RxElement
  fill: (value: string) => RxElement
  form: (value: string | number | string[] | number[]) => RxElement
  formAction: (value: string | number | string[] | number[]) => RxElement
  formEnctype: (value: string | number | string[] | number[]) => RxElement
  formMethod: (value: string | number | string[] | number[]) => RxElement
  formNoValidate: (value: string | number | string[] | number[]) => RxElement
  formTarget: (value: string | number | string[] | number[]) => RxElement
  frame: (value: string | number | string[] | number[]) => RxElement
  frameBorder: (value: string | number | string[] | number[]) => RxElement
  headers: (value: string | number | string[] | number[]) => RxElement
  hidden: (value: string | number | string[] | number[]) => RxElement
  high: (value: string | number | string[] | number[]) => RxElement
  href: (value: string | number | string[] | number[]) => RxElement
  hrefLang: (value: string | number | string[] | number[]) => RxElement
  hSpace: (value: string | number | string[] | number[]) => RxElement
  id: (value: string | number | string[] | number[]) => RxElement
  imageSizes: (value: string | number | string[] | number[]) => RxElement
  imageSrcSet: (value: string | number | string[] | number[]) => RxElement
  inputMode: (value: string | number | string[] | number[]) => RxElement
  integrity: (value: string | number | string[] | number[]) => RxElement
  is: (value: string | number | string[] | number[]) => RxElement
  isMap: (value: string | number | string[] | number[]) => RxElement
  itemId: (value: string | number | string[] | number[]) => RxElement
  itemProp: (value: string | number | string[] | number[]) => RxElement
  itemRef: (value: string | number | string[] | number[]) => RxElement
  itemScope: (value: string | number | string[] | number[]) => RxElement
  itemType: (value: string | number | string[] | number[]) => RxElement
  kind: (value: string | number | string[] | number[]) => RxElement
  label: (value: string | number | string[] | number[]) => RxElement
  lang: (value: string | number | string[] | number[]) => RxElement
  link: (value: string | number | string[] | number[]) => RxElement
  list: (value: string | number | string[] | number[]) => RxElement
  longDesc: (value: string | number | string[] | number[]) => RxElement
  loop: (value: string | number | string[] | number[]) => RxElement
  low: (value: string | number | string[] | number[]) => RxElement
  marginHeight: (value: string | number | string[] | number[]) => RxElement
  marginWidth: (value: string | number | string[] | number[]) => RxElement
  max: (value: string | number | string[] | number[]) => RxElement
  maxLength: (value: string | number | string[] | number[]) => RxElement
  media: (value: string | number | string[] | number[]) => RxElement
  method: (value: string | number | string[] | number[]) => RxElement
  min: (value: string | number | string[] | number[]) => RxElement
  minLength: (value: string | number | string[] | number[]) => RxElement
  multiple: (value: string | number | string[] | number[]) => RxElement
  muted: (value: string | number | string[] | number[]) => RxElement
  attrName: (value: string | number | string[] | number[]) => RxElement
  nonce: (value: string | number | string[] | number[]) => RxElement
  noResize: (value: string | number | string[] | number[]) => RxElement
  noShade: (value: string | number | string[] | number[]) => RxElement
  noValidate: (value: string | number | string[] | number[]) => RxElement
  noWrap: (value: string | number | string[] | number[]) => RxElement
  object: (value: string | number | string[] | number[]) => RxElement
  open: (value: string | number | string[] | number[]) => RxElement
  optimum: (value: string | number | string[] | number[]) => RxElement
  pattern: (value: string | number | string[] | number[]) => RxElement
  ping: (value: string | number | string[] | number[]) => RxElement
  placeholder: (value: string | number | string[] | number[]) => RxElement
  playsInline: (value: string | number | string[] | number[]) => RxElement
  poster: (value: string | number | string[] | number[]) => RxElement
  preload: (value: string | number | string[] | number[]) => RxElement
  profile: (value: string | number | string[] | number[]) => RxElement
  prompt: (value: string | number | string[] | number[]) => RxElement
  readOnly: (value: string | number | string[] | number[]) => RxElement
  referrerPolicy: (value: string | number | string[] | number[]) => RxElement
  rel: (value: string | number | string[] | number[]) => RxElement
  required: (value: string | number | string[] | number[]) => RxElement
  rev: (value: string | number | string[] | number[]) => RxElement
  reversed: (value: string | number | string[] | number[]) => RxElement
  rows: (value: string | number | string[] | number[]) => RxElement
  rowSpan: (value: string | number | string[] | number[]) => RxElement
  rules: (value: string | number | string[] | number[]) => RxElement
  sandBox: (value: string | number | string[] | number[]) => RxElement
  scope: (value: string | number | string[] | number[]) => RxElement
  scrolling: (value: string | number | string[] | number[]) => RxElement
  selected: (value: string | number | string[] | number[]) => RxElement
  shape: (value: string | number | string[] | number[]) => RxElement
  sizes: (value: string | number | string[] | number[]) => RxElement
  slot: (value: string | number | string[] | number[]) => RxElement
  span: (value: string | number | string[] | number[]) => RxElement
  spellCheck: (value: string | number | string[] | number[]) => RxElement
  src: (value: string | number | string[] | number[]) => RxElement
  srcDoc: (value: string | number | string[] | number[]) => RxElement
  srcSet: (value: string | number | string[] | number[]) => RxElement
  srcObject: (value: string) => RxElement
  standBy: (value: string | number | string[] | number[]) => RxElement
  start: (value: string | number | string[] | number[]) => RxElement
  step: (value: string | number | string[] | number[]) => RxElement
  summary: (value: string | number | string[] | number[]) => RxElement
  tabIndex: (value: string | number | string[] | number[]) => RxElement
  target: (value: string | number | string[] | number[]) => RxElement
  title: (value: string | number | string[] | number[]) => RxElement
  attrTransform: (value: string) => RxElement
  translate: (value: string | number | string[] | number[]) => RxElement
  type: (value: string | number | string[] | number[]) => RxElement
  typeMustMatch: (value: string | number | string[] | number[]) => RxElement
  useMap: (value: string | number | string[] | number[]) => RxElement
  vAlign: (value: string | number | string[] | number[]) => RxElement
  value?: (value: string | number | string[] | number[]) => RxElement
  valueType: (value: string | number | string[] | number[]) => RxElement
  viewBox: (value: string) => RxElement
  vLink: (value: string | number | string[] | number[]) => RxElement
  vSpace: (value: string | number | string[] | number[]) => RxElement
  wrap: (value: string | number | string[] | number[]) => RxElement
  xmlns: (value: string) => RxElement
  attrDefault: (value: string | number | string[] | number[]) => RxElement
  attrFor: (value: string | number | string[] | number[]) => RxElement
  for: (value: string | number) => RxElement
  default: (value: string | number) => RxElement


  // functional attributes
  globalStyle: (value: {[key: string]: StyleProperties}) => RxElement
  pseudoActive: (value: StyleProperties) => RxElement
  pseudoChecked: (value: StyleProperties) => RxElement
  pseudoDisabled: (value: StyleProperties) => RxElement
  pseudoEmpty: (value: StyleProperties) => RxElement
  pseudoEnabled: (value: StyleProperties) => RxElement
  pseudoFirstOfType: (value: StyleProperties) => RxElement
  pseudoFocus: (value: StyleProperties) => RxElement
  pseudoHover: (value: StyleProperties) => RxElement
  pseudoInRange: (value: StyleProperties) => RxElement
  pseudoInvalid: (value: StyleProperties) => RxElement
  pseudoLang: (value: StyleProperties) => RxElement
  pseudoLastChild: (value: StyleProperties) => RxElement
  pseudoLastOfType: (value: StyleProperties) => RxElement
  pseudoLink: (value: StyleProperties) => RxElement
  pseudoNot: (value: StyleProperties) => RxElement
  pseudoNthChild: (value: StyleProperties) => RxElement
  pseudoNthLastChild: (value: StyleProperties) => RxElement
  pseudoNthLastOfType: (value: StyleProperties) => RxElement
  pseudoNthOfType: (value: StyleProperties) => RxElement
  pseudoOnlyOfType: (value: StyleProperties) => RxElement
  pseudoOnlyChild: (value: StyleProperties) => RxElement
  pseudoOptional: (value: StyleProperties) => RxElement
  pseudoOutOfRange: (value: StyleProperties) => RxElement
  pseudoReadOnly: (value: StyleProperties) => RxElement
  pseudoReadWrite: (value: StyleProperties) => RxElement
  pseudoRequired: (value: StyleProperties) => RxElement
  pseudoRoot: (value: StyleProperties) => RxElement
  pseudoTarget: (value: StyleProperties) => RxElement
  pseudoValid: (value: StyleProperties) => RxElement
  pseudoVisited: (value: StyleProperties) => RxElement

  pseudoBefore: (value: StyleProperties) => RxElement
  pseudoAfter: (value: StyleProperties) => RxElement
  pseudoSelection: (value: StyleProperties) => RxElement
  pseudoFirstLetter: (value: StyleProperties) => RxElement
  pseudoFirstLine: (value: StyleProperties) => RxElement

  hover: (value: StyleProperties) => RxElement
} & $RxElement & LayoutFunctions;

export type ElementEvent = {
  abort?: () => void
  animationcancel?: () => void
  animationend?: () => void
  animationiteration?: () => void
  animationstart?: () => void
  auxclick?: () => void
  blur?: () => void
  cancel?: () => void
  canplay?: () => void
  canplaythrough?: () => void
  change?: () => void
  click?: () => void
  close?: () => void
  contextmenu?: () => void
  cuechange?: () => void
  dblclick?: () => void
  drag?: () => void
  dragend?: () => void
  dragenter?: () => void
  dragexit?: () => void
  dragleave?: () => void
  dragover?: () => void
  dragstart?: () => void
  drop?: () => void
  durationchange?: () => void
  emptied?: () => void
  ended?: () => void
  error?: () => void
  focus?: () => void
  focusin?: () => void
  focusout?: () => void
  gotpointercapture?: () => void
  input?: () => void
  invalid?: () => void
  keydown?: () => void
  keypress?: () => void
  keyup?: () => void
  load?: () => void
  loadeddata?: () => void
  loadedmetadata?: () => void
  loadstart?: () => void
  lostpointercapture?: () => void
  mousedown?: () => void
  mouseenter?: () => void
  mouseleave?: () => void
  mousemove?: () => void
  mouseout?: () => void
  mouseover?: () => void
  mouseup?: () => void
  pause?: () => void
  play?: () => void
  playing?: () => void
  pointercancel?: () => void
  pointerdown?: () => void
  pointerenter?: () => void
  pointerleave?: () => void
  pointermove?: () => void
  pointerout?: () => void
  pointerover?: () => void
  pointerup?: () => void
  progress?: () => void
  ratechange?: () => void
  reset?: () => void
  resize?: () => void
  scroll?: () => void
  securitypolicyviolation?: () => void
  seeked?: () => void
  seeking?: () => void
  select?: () => void
  selectionchange?: () => void
  selectstart?: () => void
  stalled?: () => void
  submit?: () => void
  suspend?: () => void
  timeupdate?: () => void
  toggle?: () => void
  touchcancel?: () => void
  touchend?: () => void
  touchmove?: () => void
  touchstart?: () => void
  transitioncancel?: () => void
  transitionend?: () => void
  transitionrun?: () => void
  transitionstart?: () => void
  volumechange?: () => void
  waiting?: () => void
  wheel?: () => void
}

export type LayoutFunctions = {
  absCenter: (value?: boolean) => RxElement | boolean
  absCenterRight: (value?: numberType) => RxElement | numberType
  absCenterLeft: (value?: numberType) => RxElement | numberType
  absCenterTop: (value?: numberType) => RxElement | numberType
  absCenterBottom: (value?: numberType) => RxElement | numberType
  absPosition: (...value: numberType[]) => RxElement | numberType[]
  absTopRight: (...value: numberType[]) => RxElement | numberType[]
  absTopLeft: (...value: numberType[]) => RxElement | numberType[]
  absBottomRight: (...value: numberType[]) => RxElement | numberType[]
  absBottomLeft: (...value: numberType[]) => RxElement | numberType[]
  absCenterVertical: (value?: boolean) => RxElement | boolean
  absCenterHorizontal: (value?: boolean) => RxElement | boolean
  addClassName: (name?: string) => RxElement
  // animate: (args?: StyleProperties) => RxElement
  // animation: (animation?: Animation) => RxElement
  // aspectRatio: (value?: boolean) => RxElement
  backgroundLinearGradient: (...value: colorType[]) => RxElement | colorType[]
  // childVerticalSpacing: (margin?: number) => RxElement
  // childHorizontalSpacing: (margin?: number) => RxElement
  // clearFix: (value?: boolean) => RxElement
  flexSpaceBetween: (value?: boolean) => RxElement | boolean
  flexCenter: (value?: boolean) => RxElement | boolean
  tag: (tag?: string) => RxElement | string
  child: (predicate?: {[key: string]: any}) => RxElement
  relCenterHorizontal: (value?: boolean) => RxElement | boolean
  removeClassName: (value?: string) => RxElement
  replaceTextTag: (text: string, tagObject: {[key: string]: typeof $RxElement}) => RxElement
  respond: (key: string, props: StyleProperties) => RxElement
  size: (...size: numberType[]) => RxElement | numberType[] | numberType
  // stack: (children: RxElement[], options: { margin?: numberType, vertical?: boolean, horizontal?: boolean }) => RxElement
  // stackVertical: (children: RxElement[]) => RxElement | boolean
  truncateText: (value?: boolean) => RxElement | boolean
}
