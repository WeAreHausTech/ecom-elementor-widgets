!// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
function(e,r,t,n,l){/* eslint-disable no-undef */var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},a="function"==typeof o[n]&&o[n],s=a.cache||{},u="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function c(r,t){if(!s[r]){if(!e[r]){// if we cannot find the module within our internal map or
// cache jump to the current global require ie. the last bundle
// that was added to the page.
var l="function"==typeof o[n]&&o[n];if(!t&&l)return l(r,!0);// If there are other bundles on this page the require from the
// previous one is saved to 'previousRequire'. Repeat this as
// many times as there are bundles until the module is found or
// we exhaust the require chain.
if(a)return a(r,!0);// Try the node require function if it exists.
if(u&&"string"==typeof r)return u(r);var i=Error("Cannot find module '"+r+"'");throw i.code="MODULE_NOT_FOUND",i}d.resolve=function(t){var n=e[r][1][t];return null!=n?n:t},d.cache={};var f=s[r]=new c.Module(r);e[r][0].call(f.exports,d,f,f.exports,this)}return s[r].exports;function d(e){var r=d.resolve(e);return!1===r?{}:c(r)}}c.isParcelRequire=!0,c.Module=function(e){this.id=e,this.bundle=c,this.exports={}},c.modules=e,c.cache=s,c.parent=a,c.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]},Object.defineProperty(c,"root",{get:function(){return o[n]}}),o[n]=c;for(var i=0;i<r.length;i++)c(r[i]);if(t){// Expose entry point to Node, AMD or browser globals
// Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
var f=c(t);// CommonJS
"object"==typeof exports&&"undefined"!=typeof module?module.exports=f:"function"==typeof define&&define.amd?define(function(){return f}):l&&(this[l]=f)}}({fW5l8:[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function l(){return(l=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e}).apply(this,arguments)}n.defineInteropFlag(t),n.export(t,"default",()=>l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"8XJVQ":[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");function l(e,r,{checkForDefaultPrevented:t=!0}={}){return function(n){if(null==e||e(n),!1===t||!n.defaultPrevented)return null==r?void 0:r(n)}}n.defineInteropFlag(t),n.export(t,"composeEventHandlers",()=>l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"3o8Il":[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"createCollection",()=>c);var l=e("react"),o=n.interopDefault(l),a=e("@radix-ui/react-context"),s=e("@radix-ui/react-compose-refs"),u=e("@radix-ui/react-slot");// We have resorted to returning slots directly rather than exposing primitives that can then
// be slotted like `<CollectionItem as={Slot}>…</CollectionItem>`.
// This is because we encountered issues with generic types that cannot be statically analysed
// due to creating them dynamically via createCollection.
function c(e){/* -----------------------------------------------------------------------------------------------
   * CollectionProvider
   * ---------------------------------------------------------------------------------------------*/let r=e+"CollectionProvider",[t,n]=(0,a.createContextScope)(r),[l,c]=t(r,{collectionRef:{current:null},itemMap:new Map}),i=e+"CollectionSlot",f=/*#__PURE__*/(0,o.default).forwardRef((e,r)=>{let{scope:t,children:n}=e,l=c(i,t),a=(0,s.useComposedRefs)(r,l.collectionRef);return/*#__PURE__*/(0,o.default).createElement(u.Slot,{ref:a},n)}),d=e+"CollectionItemSlot",p="data-radix-collection-item",m=/*#__PURE__*/(0,o.default).forwardRef((e,r)=>{let{scope:t,children:n,...l}=e,a=(0,o.default).useRef(null),i=(0,s.useComposedRefs)(r,a),f=c(d,t);return(0,o.default).useEffect(()=>(f.itemMap.set(a,{ref:a,...l}),()=>void f.itemMap.delete(a))),/*#__PURE__*/(0,o.default).createElement(u.Slot,{[p]:"",ref:i},n)});return[{Provider:e=>{let{scope:r,children:t}=e,n=(0,o.default).useRef(null),a=(0,o.default).useRef(new Map).current;return/*#__PURE__*/(0,o.default).createElement(l,{scope:r,itemMap:a,collectionRef:n},t)},Slot:f,ItemSlot:m},/* -----------------------------------------------------------------------------------------------
   * useCollection
   * ---------------------------------------------------------------------------------------------*/function(r){let t=c(e+"CollectionConsumer",r),n=(0,o.default).useCallback(()=>{let e=t.collectionRef.current;if(!e)return[];let r=Array.from(e.querySelectorAll(`[${p}]`)),n=Array.from(t.itemMap.values()),l=n.sort((e,t)=>r.indexOf(e.ref.current)-r.indexOf(t.ref.current));return l},[t.collectionRef,t.itemMap]);return n},n]}},{react:"6uln9","@radix-ui/react-context":"hjQSh","@radix-ui/react-compose-refs":"3TI02","@radix-ui/react-slot":"cA0RI","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],hjQSh:[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"createContext",()=>o),n.export(t,"createContextScope",()=>a);var l=e("react");function o(e,r){let t=/*#__PURE__*/(0,l.createContext)(r);function n(e){let{children:r,...n}=e,o=(0,l.useMemo)(()=>n,Object.values(n));// Only re-memoize when prop values change
return/*#__PURE__*/(0,l.createElement)(t.Provider,{value:o},r)}return n.displayName=e+"Provider",[n,function(n){let o=(0,l.useContext)(t);if(o)return o;if(void 0!==r)return r;// if a defaultContext wasn't specified, it's a required context.
throw Error(`\`${n}\` must be used within \`${e}\``)}]}/* -------------------------------------------------------------------------------------------------
 * createContextScope
 * -----------------------------------------------------------------------------------------------*/function a(e,r=[]){let t=[],n=()=>{let r=t.map(e=>/*#__PURE__*/(0,l.createContext)(e));return function(t){let n=(null==t?void 0:t[e])||r;return(0,l.useMemo)(()=>({[`__scope${e}`]:{...t,[e]:n}}),[t,n])}};return n.scopeName=e,[/* -----------------------------------------------------------------------------------------------
   * createContext
   * ---------------------------------------------------------------------------------------------*/function(r,n){let o=/*#__PURE__*/(0,l.createContext)(n),a=t.length;function s(r){let{scope:t,children:n,...s}=r,u=(null==t?void 0:t[e][a])||o,c=(0,l.useMemo)(()=>s,Object.values(s));return/*#__PURE__*/(0,l.createElement)(u.Provider,{value:c},n)}return t=[...t,n],s.displayName=r+"Provider",[s,function(t,s){let u=(null==s?void 0:s[e][a])||o,c=(0,l.useContext)(u);if(c)return c;if(void 0!==n)return n;// if a defaultContext wasn't specified, it's a required context.
throw Error(`\`${t}\` must be used within \`${r}\``)}]},/* -------------------------------------------------------------------------------------------------
 * composeContextScopes
 * -----------------------------------------------------------------------------------------------*/function(...e){let r=e[0];if(1===e.length)return r;let t=()=>{let t=e.map(e=>({useScope:e(),scopeName:e.scopeName}));return function(e){let n=t.reduce((r,{useScope:t,scopeName:n})=>{// We are calling a hook inside a callback which React warns against to avoid inconsistent
// renders, however, scoping doesn't have render side effects so we ignore the rule.
// eslint-disable-next-line react-hooks/rules-of-hooks
let l=t(e),o=l[`__scope${n}`];return{...r,...o}},{});return(0,l.useMemo)(()=>({[`__scope${r.scopeName}`]:n}),[n])}};return t.scopeName=r.scopeName,t}(n,...r)]}},{react:"6uln9","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"3TI02":[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"composeRefs",()=>o),n.export(t,"useComposedRefs",()=>a);var l=e("react");/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 */function o(...e){return r=>e.forEach(e=>{"function"==typeof e?e(r):null!=e&&(e.current=r)})}/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 */function a(...e){// eslint-disable-next-line react-hooks/exhaustive-deps
return(0,l.useCallback)(o(...e),e)}},{react:"6uln9","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],cA0RI:[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"Slot",()=>u),n.export(t,"Slottable",()=>i),n.export(t,"Root",()=>d);var l=e("@babel/runtime/helpers/esm/extends"),o=n.interopDefault(l),a=e("react"),s=e("@radix-ui/react-compose-refs");/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/let u=/*#__PURE__*/(0,a.forwardRef)((e,r)=>{let{children:t,...n}=e,l=(0,a.Children).toArray(t),s=l.find(f);if(s){// the new element to render is the one passed as a child of `Slottable`
let e=s.props.children,t=l.map(r=>r!==s?r:// because the new element will be the one rendered, we are only interested
    // in grabbing its children (`newElement.props.children`)
    (0,a.Children).count(e)>1?(0,a.Children).only(null):/*#__PURE__*/(0,a.isValidElement)(e)?e.props.children:null);return/*#__PURE__*/(0,a.createElement)(c,(0,o.default)({},n,{ref:r}),/*#__PURE__*/(0,a.isValidElement)(e)?/*#__PURE__*/(0,a.cloneElement)(e,void 0,t):null)}return/*#__PURE__*/(0,a.createElement)(c,(0,o.default)({},n,{ref:r}),t)});u.displayName="Slot";/* -------------------------------------------------------------------------------------------------
 * SlotClone
 * -----------------------------------------------------------------------------------------------*/let c=/*#__PURE__*/(0,a.forwardRef)((e,r)=>{let{children:t,...n}=e;return/*#__PURE__*/(0,a.isValidElement)(t)?/*#__PURE__*/(0,a.cloneElement)(t,{...function(e,r){// all child props should override
let t={...r};for(let n in r){let l=e[n],o=r[n],a=/^on[A-Z]/.test(n);a?l&&o?t[n]=(...e)=>{o(...e),l(...e)}:l&&(t[n]=l):"style"===n?t[n]={...l,...o}:"className"===n&&(t[n]=[l,o].filter(Boolean).join(" "))}return{...e,...t}}(n,t.props),ref:r?(0,s.composeRefs)(r,t.ref):t.ref}):(0,a.Children).count(t)>1?(0,a.Children).only(null):null});c.displayName="SlotClone";/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/let i=({children:e})=>/*#__PURE__*/(0,a.createElement)(a.Fragment,null,e);/* ---------------------------------------------------------------------------------------------- */function f(e){return/*#__PURE__*/(0,a.isValidElement)(e)&&e.type===i}let d=u},{"@babel/runtime/helpers/esm/extends":"fW5l8",react:"6uln9","@radix-ui/react-compose-refs":"3TI02","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"7D0d7":[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"useDirection",()=>s),n.export(t,"Provider",()=>u),n.export(t,"DirectionProvider",()=>a);var l=e("react");let o=/*#__PURE__*/(0,l.createContext)(void 0),a=e=>{let{dir:r,children:t}=e;return/*#__PURE__*/(0,l.createElement)(o.Provider,{value:r},t)};/* -----------------------------------------------------------------------------------------------*/function s(e){let r=(0,l.useContext)(o);return e||r||"ltr"}let u=a},{react:"6uln9","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"12EJa":[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"Primitive",()=>c),n.export(t,"Root",()=>f),n.export(t,"dispatchDiscreteCustomEvent",()=>i);var l=e("@babel/runtime/helpers/esm/extends"),o=n.interopDefault(l),a=e("react"),s=e("react-dom"),u=e("@radix-ui/react-slot");// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55396
// prettier-ignore
/* -------------------------------------------------------------------------------------------------
 * Primitive
 * -----------------------------------------------------------------------------------------------*/let c=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"].reduce((e,r)=>{let t=/*#__PURE__*/(0,a.forwardRef)((e,t)=>{let{asChild:n,...l}=e,s=n?u.Slot:r;return(0,a.useEffect)(()=>{window[Symbol.for("radix-ui")]=!0},[]),/*#__PURE__*/(0,a.createElement)(s,(0,o.default)({},l,{ref:t}))});return t.displayName=`Primitive.${r}`,{...e,[r]:t}},{});/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*//**
 * Flush custom event dispatch
 * https://github.com/radix-ui/primitives/pull/1378
 *
 * React batches *all* event handlers since version 18, this introduces certain considerations when using custom event types.
 *
 * Internally, React prioritises events in the following order:
 *  - discrete
 *  - continuous
 *  - default
 *
 * https://github.com/facebook/react/blob/a8a4742f1c54493df00da648a3f9d26e3db9c8b5/packages/react-dom/src/events/ReactDOMEventListener.js#L294-L350
 *
 * `discrete` is an  important distinction as updates within these events are applied immediately.
 * React however, is not able to infer the priority of custom event types due to how they are detected internally.
 * Because of this, it's possible for updates from custom events to be unexpectedly batched when
 * dispatched by another `discrete` event.
 *
 * In order to ensure that updates from custom events are applied predictably, we need to manually flush the batch.
 * This utility should be used when dispatching a custom event from within another `discrete` event, this utility
 * is not nessesary when dispatching known event types, or if dispatching a custom type inside a non-discrete event.
 * For example:
 *
 * dispatching a known click 👎
 * target.dispatchEvent(new Event(‘click’))
 *
 * dispatching a custom type within a non-discrete event 👎
 * onScroll={(event) => event.target.dispatchEvent(new CustomEvent(‘customType’))}
 *
 * dispatching a custom type within a `discrete` event 👍
 * onPointerDown={(event) => dispatchDiscreteCustomEvent(event.target, new CustomEvent(‘customType’))}
 *
 * Note: though React classifies `focus`, `focusin` and `focusout` events as `discrete`, it's  not recommended to use
 * this utility with them. This is because it's possible for those handlers to be called implicitly during render
 * e.g. when focus is within a component as it is unmounted, or when managing focus on mount.
 */function i(e,r){e&&(0,s.flushSync)(()=>e.dispatchEvent(r))}/* -----------------------------------------------------------------------------------------------*/let f=c},{"@babel/runtime/helpers/esm/extends":"fW5l8",react:"6uln9","react-dom":"b8T3j","@radix-ui/react-slot":"cA0RI","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],bjdTR:[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"useCallbackRef",()=>o);var l=e("react");/**
 * A custom hook that converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop or avoid re-executing effects when passed as a dependency
 */function o(e){let r=(0,l.useRef)(e);return(0,l.useEffect)(()=>{r.current=e}),(0,l.useMemo)(()=>(...e)=>{var t;return null===(t=r.current)||void 0===t?void 0:t.call(r,...e)},[])}},{react:"6uln9","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"1iLBO":[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"useId",()=>u);var l=e("react"),o=e("@radix-ui/react-use-layout-effect");let a=l["useId".toString()]||(()=>void 0),s=0;function u(e){let[r,t]=l.useState(a());// React versions older than 18 will have client-side ids only.
return(0,o.useLayoutEffect)(()=>{e||t(e=>null!=e?e:String(s++))},[e]),e||(r?`radix-${r}`:"")}},{react:"6uln9","@radix-ui/react-use-layout-effect":"fkPUP","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],fkPUP:[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"useLayoutEffect",()=>o);var l=e("react");/**
 * On the server, React emits a warning when calling `useLayoutEffect`.
 * This is because neither `useLayoutEffect` nor `useEffect` run on the server.
 * We use this safe version which suppresses the warning by replacing it with a noop on the server.
 *
 * See: https://reactjs.org/docs/hooks-reference.html#uselayouteffect
 */let o=(null==globalThis?void 0:globalThis.document)?l.useLayoutEffect:()=>{}},{react:"6uln9","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],E30Th:[function(e,r,t){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(t),n.export(t,"useControllableState",()=>a);var l=e("react"),o=e("@radix-ui/react-use-callback-ref");function a({prop:e,defaultProp:r,onChange:t=()=>{}}){let[n,a]=function({defaultProp:e,onChange:r}){let t=(0,l.useState)(e),[n]=t,a=(0,l.useRef)(n),s=(0,o.useCallbackRef)(r);return(0,l.useEffect)(()=>{a.current!==n&&(s(n),a.current=n)},[n,a,s]),t}({defaultProp:r,onChange:t}),s=void 0!==e,u=s?e:n,c=(0,o.useCallbackRef)(t),i=(0,l.useCallback)(r=>{if(s){let t="function"==typeof r?r(e):r;t!==e&&c(t)}else a(r)},[s,e,a,c]);return[u,i]}},{react:"6uln9","@radix-ui/react-use-callback-ref":"bjdTR","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}]},[],null,"parcelRequire2d1d")//# sourceMappingURL=ProductList.01131c96.js.map
;
//# sourceMappingURL=ProductList.01131c96.js.map
