(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/videolist/index"],{"4c74":function(t,e,n){},"5d2d":function(t,e,n){"use strict";var a;n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return i})),n.d(e,"a",(function(){return a}));var r=function(){var t=this,e=t.$createElement;t._self._c},i=[]},"6b2f":function(t,e,n){"use strict";(function(t){n("6cdc");a(n("66fd"));var e=a(n("e2f8"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},"78fe":function(t,e,n){"use strict";n.r(e);var a=n("ef3e"),r=n.n(a);for(var i in a)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return a[t]}))}(i);e["default"]=r.a},"8c73":function(t,e,n){"use strict";var a=n("4c74"),r=n.n(a);r.a},e2f8:function(t,e,n){"use strict";n.r(e);var a=n("5d2d"),r=n("78fe");for(var i in r)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return r[t]}))}(i);n("8c73");var o,u=n("f0c5"),c=Object(u["a"])(r["default"],a["b"],a["c"],!1,null,"227cd848",null,!1,a["a"],o);e["default"]=c.exports},ef3e:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=i(n("a34a")),r=i(n("4b90"));function i(t){return t&&t.__esModule?t:{default:t}}function o(t){return l(t)||f(t)||c(t)||u()}function u(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(t,e){if(t){if("string"===typeof t)return d(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?d(t,e):void 0}}function f(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function l(t){if(Array.isArray(t))return d(t)}function d(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}function s(t,e,n,a,r,i,o){try{var u=t[i](o),c=u.value}catch(f){return void n(f)}u.done?e(c):Promise.resolve(c).then(a,r)}function p(t){return function(){var e=this,n=arguments;return new Promise((function(a,r){var i=t.apply(e,n);function o(t){s(i,a,r,o,u,"next",t)}function u(t){s(i,a,r,o,u,"throw",t)}o(void 0)}))}}var g={data:function(){return{listData:[],pageDone:!1,pageNum:1}},onLoad:function(){this.getData(1,!0)},onPullDownRefresh:function(){this.getData(1,!0).finally((function(){t.stopPullDownRefresh()}))},onReachBottom:function(){this.pageDone||this.getData(this.pageNum+1)},methods:{getData:function(e,n){var r=this;return p(a.default.mark((function i(){var u;return a.default.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return{pageNum:e,pageSize:15},r.pageDone=!1,a.next=4,{code:200,data:[{id:payload.pageNum+"1",title:"请支持布地格服吸入气雾剂进入医保.",img:"",size:109},{id:payload.pageNum+"2",title:"请支持布地格服吸入气雾剂进入医保请支持布地格服吸入气雾剂进入医保请支持布地格服吸入气雾剂进入医保.",img:"",size:23309},{id:payload.pageNum+"3",title:"请支持布地格服吸入气雾剂进入医保.",img:"",size:109},{id:payload.pageNum+"4",title:"请支持布地格服吸入气雾剂进入医保.",img:"",size:109},{id:payload.pageNum+"5",title:"请支持布地格服吸入气雾剂进入医保.",img:"",size:109}]};case 4:return u=a.sent,u&&200===u.code&&u.data.length?(n?(r.listData=u.data,t.pageScrollTo({scrollTop:0})):r.listData=[].concat(o(r.listData),o(u.data)),r.pageNum=e):r.pageDone=!0,a.abrupt("return",u);case 7:case"end":return a.stop()}}),i)})))()},goToDetail:function(e){t.navigateTo({url:r.default.urlStringify("/pages/articleDetail/index",{id:e.id})})}}};e.default=g}).call(this,n("543d")["default"])}},[["6b2f","common/runtime","common/vendor"]]]);