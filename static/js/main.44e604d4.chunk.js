(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{102:function(e,t){},158:function(e,t,a){e.exports=a(364)},163:function(e,t,a){},175:function(e,t){},177:function(e,t){},202:function(e,t){},232:function(e,t){},361:function(e,t,a){},364:function(e,t,a){"use strict";a.r(t);var n,r=a(0),s=a.n(r),i=a(148),c=a.n(i),o=(a(163),a(7)),d=a.n(o),l=a(21),u=a(149),p=a(150),m=a(156),h=a(151),v=a(157),f=a(44),y=a(369),E=a(24),b=a(27),k=a(6),g=a(10);function A(e){var t=new Set;try{var a=k.Encoding.fromHex(e);t.add(n.Hex),20===a.length&&t.add(n.ByteLength20),32===a.length&&t.add(n.ByteLength32)}catch(i){}try{var r=k.Bech32.decode(e);t.add(n.Bech32),"iov"===r.prefix&&t.add(n.IovAddressMainnet),"tiov"===r.prefix&&t.add(n.IovAddressTestnet)}catch(c){}try{var s=new g.EnglishMnemonic(e);t.add(n.EnglishMnemonic),8*g.Bip39.decode(s).length===128&&t.add(n.EnglishMnemonic12Words)}catch(o){}return e.match(/^[a-z0-9\.,\+\-_@]{4,64}$/)&&(t.add(n.BnsUsername),t.add(n.BnsBlockchain)),E.liskCodec.isValidAddress(e)&&t.add(n.LiskAddress),b.riseCodec.isValidAddress(e)&&t.add(n.RiseAddress),t}!function(e){e[e.Hex=0]="Hex",e[e.Bech32=1]="Bech32",e[e.ByteLength20=2]="ByteLength20",e[e.ByteLength32=3]="ByteLength32",e[e.EnglishMnemonic=4]="EnglishMnemonic",e[e.EnglishMnemonic12Words=5]="EnglishMnemonic12Words",e[e.IovAddressMainnet=6]="IovAddressMainnet",e[e.IovAddressTestnet=7]="IovAddressTestnet",e[e.BnsUsername=8]="BnsUsername",e[e.BnsBlockchain=9]="BnsBlockchain",e[e.LiskAddress=10]="LiskAddress",e[e.RiseAddress=11]="RiseAddress"}(n||(n={}));var x=a(367),w=a(59),B=a(60),N=a(153),C=a.n(N);function L(e){var t=e.quantity.slice(0,-e.fractionalDigits)||"0",a=C()(e.quantity.slice(-e.fractionalDigits)||"0",e.fractionalDigits,"0").replace(/0+$/,"")||"0";return"".concat(t,".").concat(a," ").concat(e.tokenTicker)}var I=a(19),j=k.Encoding.toHex,D=new Map;function O(e,t,a,n,r){return{id:e,priority:t,interpretedAs:a,getData:function(){var e=Object(l.a)(d.a.mark(function e(){var t,a;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return D.has(r.url)||D.set(r.url,w.BnsConnection.establish(r.url)),e.next=3,D.get(r.url);case 3:return t=e.sent,e.next=6,t.getAccount(n);case 6:return a=e.sent,e.abrupt("return",a);case 8:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),renderData:function(n){var r;if(n.data.length>0){var i=n.data[0],c=i.address,o=i.balance,d=i.name;r=s.a.createElement("div",null,"Address: ",s.a.createElement(x.a,{to:"#"+c},c),s.a.createElement("br",null),"Name: ",d?s.a.createElement(x.a,{to:"#"+d},d):"<none>",s.a.createElement("br",null),"Balance: ",o.map(L).join(", "))}else r=s.a.createElement("span",{className:"inactive"},"Account not found");return{id:e,interpretedAs:a,priority:t,data:r}}}}function M(e,t){return O("".concat(e,"#").concat(t.name,"-bns-address"),9,"Address on ".concat(t.name),{address:e},t)}function T(e,t){return O("".concat(e,"#").concat(t.name,"-bns-name"),11,"Name on ".concat(t.name),{name:e},t)}function H(e,t){var a="".concat(e,"#").concat(t.name,"-lisk-address"),n="Address on ".concat(t.name);return{id:a,priority:10,interpretedAs:n,getData:function(){var a=Object(l.a)(d.a.mark(function a(){var n,r;return d.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return D.has(t.url)||D.set(t.url,E.LiskConnection.establish(t.url)),a.next=3,D.get(t.url);case 3:return n=a.sent,a.next=6,n.getAccount({address:e});case 6:return r=a.sent,a.abrupt("return",r);case 8:case"end":return a.stop()}},a,this)}));return function(){return a.apply(this,arguments)}}(),renderData:function(e){var t;if(e.data.length>0){var r=e.data[0],i=r.address,c=r.balance;r.name;t=s.a.createElement("div",null,"Address: ",s.a.createElement(x.a,{to:"#"+i},i),s.a.createElement("br",null),"Balance: ",c.map(L).join(", "))}else t=s.a.createElement("span",{className:"inactive"},"Account not found");return{id:a,interpretedAs:n,priority:10,data:t}}}}function R(e,t){var a="".concat(e,"#").concat(t.name,"-rise-address"),n="Address on ".concat(t.name);return{id:a,priority:10,interpretedAs:n,getData:function(){var a=Object(l.a)(d.a.mark(function a(){var n,r;return d.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return D.has(t.url)||D.set(t.url,b.RiseConnection.establish(t.url)),a.next=3,D.get(t.url);case 3:return n=a.sent,a.next=6,n.getAccount({address:e});case 6:return r=a.sent,a.abrupt("return",r);case 8:case"end":return a.stop()}},a,this)}));return function(){return a.apply(this,arguments)}}(),renderData:function(e){var t;if(e.data.length>0){var r=e.data[0],i=r.address,c=r.balance;r.name;t=s.a.createElement("div",null,"Address: ",s.a.createElement(x.a,{to:"#"+i},i),s.a.createElement("br",null),"Balance: ",c.map(L).join(", "))}else t=s.a.createElement("span",{className:"inactive"},"Account not found");return{id:a,interpretedAs:n,priority:10,data:t}}}}function S(e){var t=k.Bech32.decode(e);return{id:"".concat(e,"#bech32"),interpretedAs:"Bech32 address",priority:10,data:s.a.createElement("div",null,"Prefix: ",t.prefix,s.a.createElement("br",null),"Data: ",s.a.createElement(x.a,{to:"#"+j(t.data)},j(t.data)))}}function W(e){var t=k.Encoding.fromHex(e);return{id:"".concat(e,"#hex-summary"),interpretedAs:"Hex data summary",priority:20,data:s.a.createElement("div",null,"Length: ",t.length," bytes",s.a.createElement("br",null),s.a.createElement("div",{className:"pair"},s.a.createElement("div",{className:"pair-key"},"Lower:\xa0"),s.a.createElement("div",{className:"pair-value data"},e.toLowerCase())),s.a.createElement("div",{className:"pair"},s.a.createElement("div",{className:"pair-key"},"Upper:\xa0"),s.a.createElement("div",{className:"pair-value data"},e.toUpperCase())))}}function U(e){var t=k.Encoding.fromHex(e),a=k.Bech32.encode("tiov",t),n=k.Bech32.encode("iov",t);return{id:"".concat(e,"#weave-address"),interpretedAs:"Weave address",priority:10,data:s.a.createElement("div",null,"IOV test: ",s.a.createElement(x.a,{to:"#"+a},a),s.a.createElement("br",null),"IOV main: ",s.a.createElement(x.a,{to:"#"+n},n))}}function Q(e){var t={algo:I.Algorithm.Ed25519,data:k.Encoding.fromHex(e)},a=w.bnsCodec.keyToAddress(t),n=E.liskCodec.keyToAddress(t),r=b.riseCodec.keyToAddress(t);return{id:"".concat(e,"#weave-address"),interpretedAs:"Ed25519 public key",priority:7,data:s.a.createElement("div",null,"BNS: ",s.a.createElement(x.a,{to:"#"+a},a),s.a.createElement("br",null),"Lisk: ",s.a.createElement(x.a,{to:"#"+n},n),s.a.createElement("br",null),"Rise: ",s.a.createElement(x.a,{to:"#"+r},r),s.a.createElement("br",null))}}function V(e){return q.apply(this,arguments)}function q(){return(q=Object(l.a)(d.a.mark(function e(t){var a,n,r,i,c,o,l;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a=B.Ed25519HdWallet.fromMnemonic(t),n=[],r=0;case 3:if(!(r<5)){e.next=13;break}return i=B.HdPaths.simpleAddress(r),e.next=7,a.createIdentity(i);case 7:c=e.sent.pubkey,o=w.bnsCodec.keyToAddress(c),n.push({path:"4804438'/".concat(r,"'"),address:o});case 10:++r,e.next=3;break;case 13:return l=n.map(function(e){return s.a.createElement("div",{key:e.path},s.a.createElement("span",{className:"mono"},e.path),": ",s.a.createElement(x.a,{to:"#"+e.address},e.address))}),e.abrupt("return",{id:"".concat(t,"#hd-wallet-simple-address"),interpretedAs:"Simple Address HD Wallet",priority:8,data:s.a.createElement("div",null,l)});case 15:case"end":return e.stop()}},e,this)}))).apply(this,arguments)}function J(e,t,a,n){return P.apply(this,arguments)}function P(){return(P=Object(l.a)(d.a.mark(function e(t,a,n,r){var i,c,o,l,u,p,m;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:i=B.Ed25519HdWallet.fromMnemonic(t),c=[],o=0;case 3:if(!(o<5)){e.next=13;break}return l=[g.Slip10RawIndex.hardened(44),g.Slip10RawIndex.hardened(a),g.Slip10RawIndex.hardened(o)],e.next=7,i.createIdentity(l);case 7:u=e.sent.pubkey,p=r.keyToAddress(u),c.push({path:"44'/".concat(a,"'/").concat(o,"'"),address:p});case 10:++o,e.next=3;break;case 13:return m=c.map(function(e){return s.a.createElement("div",{key:e.path},s.a.createElement("span",{className:"mono"},e.path),": ",s.a.createElement(x.a,{to:"#"+e.address},e.address))}),e.abrupt("return",{id:"".concat(t,"#hd-wallet-coin").concat(a),interpretedAs:"".concat(n," HD Wallet"),priority:8,data:s.a.createElement("div",null,m)});case 15:case"end":return e.stop()}},e,this)}))).apply(this,arguments)}function X(e){return Y.apply(this,arguments)}function Y(){return(Y=Object(l.a)(d.a.mark(function e(t){var a,n,r;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=I.Algorithm.Ed25519,e.next=3,Object(E.passphraseToKeypair)(t);case 3:return e.t1=e.sent.pubkey,a={algo:e.t0,data:e.t1},n=E.liskCodec.keyToAddress(a),r=b.riseCodec.keyToAddress(a),e.abrupt("return",{id:"".concat(t,"#lisk-like-passphrase"),interpretedAs:"Lisk-like passphrase",priority:7,data:s.a.createElement("div",null,"Lisk: ",s.a.createElement(x.a,{to:"#"+n},n),s.a.createElement("br",null),"Rise: ",s.a.createElement(x.a,{to:"#"+r},r),s.a.createElement("br",null))});case 8:case"end":return e.stop()}},e,this)}))).apply(this,arguments)}function $(e){var t,a=new g.EnglishMnemonic(e),n=g.Bip39.decode(a);switch(8*n.length){case 128:t=12;break;case 160:t=15;break;case 192:t=18;break;case 224:t=21;break;case 256:t=24;break;default:throw new Error("Unsupported entropy length")}return{id:"".concat(e,"#bip39-english-mnemonic"),interpretedAs:"Bip39 english mnemonic",priority:11,data:s.a.createElement("div",null,"Words: ",t,s.a.createElement("br",null),"ENT: ",8*n.length,s.a.createElement("br",null),s.a.createElement("div",{className:"pair"},s.a.createElement("div",{className:"pair-key"},"Entropy:\xa0"),s.a.createElement("div",{className:"pair-value data"},j(n))))}}function z(e){return"function"===typeof e.getData&&"function"===typeof e.renderData}var F=[{name:"Yaknet (bnsd)",url:"https://bns.yaknet.iov.one"},{name:"Yaknet (bcpd)",url:"https://bov.yaknet.iov.one"},{name:"Xerusnet (bnsd)",url:"https://bns.xerusnet.iov.one"},{name:"Xerusnet (bcpd)",url:"https://bov.xerusnet.iov.one"}],K=[{name:"Lisk Testnet",url:"https://testnet.lisk.io"},{name:"Lisk Mainnet",url:"https://hub32.lisk.io"}],_=[{name:"RISE Testnet",url:"https://twallet.rise.vision"},{name:"RISE Mainnet",url:"https://wallet.rise.vision"}],G=[{name:"Lisk",number:134,codec:E.liskCodec},{name:"RISE",number:1120,codec:b.riseCodec}];function Z(e){return ee.apply(this,arguments)}function ee(){return(ee=Object(l.a)(d.a.mark(function e(t){var a,r,s,i,c,o,l,u,p,m,h,v;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(a=A(t),r=new Array,a.has(n.IovAddressTestnet))for(s=0;s<F.length;s++)i=F[s],r.push(M(t,i));if(a.has(n.BnsUsername))for(c=0;c<F.length;c++)o=F[c],r.push(T(t,o));if(!a.has(n.EnglishMnemonic)){e.next=28;break}return r.push($(t)),e.t0=r,e.next=9,V(t);case 9:e.t1=e.sent,e.t0.push.call(e.t0,e.t1),l=0;case 12:if(!(l<G.length)){e.next=22;break}return u=G[l],e.t2=r,e.next=17,J(t,u.number,u.name,u.codec);case 17:e.t3=e.sent,e.t2.push.call(e.t2,e.t3);case 19:l++,e.next=12;break;case 22:if(!a.has(n.EnglishMnemonic12Words)){e.next=28;break}return e.t4=r,e.next=26,X(t);case 26:e.t5=e.sent,e.t4.push.call(e.t4,e.t5);case 28:if(a.has(n.Bech32)&&r.push(S(t)),a.has(n.Hex)&&(a.has(n.ByteLength20)&&r.push(U(t)),a.has(n.ByteLength32)&&r.push(Q(t)),r.push(W(t))),a.has(n.LiskAddress))for(p=0;p<K.length;p++)m=K[p],r.push(H(t,m));if(a.has(n.RiseAddress))for(h=0;h<_.length;h++)v=_[h],r.push(R(t,v));return r.sort(function(e,t){return e.priority-t.priority}),e.abrupt("return",r);case 34:case"end":return e.stop()}},e,this)}))).apply(this,arguments)}a(361);var te=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(m.a)(this,Object(h.a)(t).call(this,e))).timeouts=[],a.state={input:"",display:[]},a.props.history.listen(function(e,t){var n=e.hash.slice(1);a.handleQuery(n)}),a.handleChange=a.handleChange.bind(Object(f.a)(Object(f.a)(a))),a}return Object(v.a)(t,e),Object(p.a)(t,[{key:"componentDidMount",value:function(){var e=this.props.location.hash.slice(1),t=decodeURIComponent(e);console.log("Initial query",t),this.handleQuery(t)}},{key:"updateDisplay",value:function(e){var t=this.state.display.map(function(e){return e}),a=t.findIndex(function(t){return t.id==e.id});t[a]=e,this.setState({display:t})}},{key:"handleChange",value:function(e){var t=e.target.value;console.log("handle change called",t),this.handleQuery(t)}},{key:"handleQuery",value:function(){var e=Object(l.a)(d.a.mark(function e(t){var a,n,r,i,c,o,l,u,p,m,h,v,f,y,E=this;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Z(t);case 2:for(a=e.sent,n=a.map(function(e){return z(e)?{id:e.id,interpretedAs:e.interpretedAs,priority:e.priority,data:s.a.createElement("div",null,"Loading ...")}:e}),r=!0,i=!1,c=void 0,e.prev=7,o=this.timeouts[Symbol.iterator]();!(r=(l=o.next()).done);r=!0)u=l.value,clearTimeout(u);e.next=15;break;case 11:e.prev=11,e.t0=e.catch(7),i=!0,c=e.t0;case 15:e.prev=15,e.prev=16,r||null==o.return||o.return();case 18:if(e.prev=18,!i){e.next=21;break}throw c;case 21:return e.finish(18);case 22:return e.finish(15);case 23:for(p=!0,m=!1,h=void 0,e.prev=26,v=function(){var e=y.value;E.timeouts.push(setTimeout(function(){e.getData().then(function(t){return e.renderData(t)}).catch(function(t){return{id:e.id,interpretedAs:e.interpretedAs,priority:e.priority,data:s.a.createElement("div",{className:"error"},t.toString())}}).then(function(e){E.updateDisplay(e)})},500))},f=a.filter(z)[Symbol.iterator]();!(p=(y=f.next()).done);p=!0)v();e.next=35;break;case 31:e.prev=31,e.t1=e.catch(26),m=!0,h=e.t1;case 35:e.prev=35,e.prev=36,p||null==f.return||f.return();case 38:if(e.prev=38,!m){e.next=41;break}throw h;case 41:return e.finish(38);case 42:return e.finish(35);case 43:this.setState({input:t,display:n});case 44:case"end":return e.stop()}},e,this,[[7,11,15,23],[16,,18,22],[26,31,35,43],[36,,38,42]])}));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state?this.state.display.map(function(e){return s.a.createElement("div",{key:e.id,className:"display"},s.a.createElement("div",{className:"display-title"},e.interpretedAs),s.a.createElement("div",{className:"display-data"},e.data))}):[];return s.a.createElement("div",{className:"App"},s.a.createElement("header",{className:"App-header"},s.a.createElement("input",{className:"maininput",type:"text",placeholder:"hex address, bech32 address, pubkey, mnemonic \u2026",value:this.state.input,onChange:this.handleChange,autoFocus:!0}),s.a.createElement("div",{className:"display-container"},s.a.createElement("div",{className:"pair"},s.a.createElement("div",{className:"pair-key"},s.a.createElement("small",null,"Direct link:\xa0")),s.a.createElement("div",{className:"pair-value"},s.a.createElement("input",{type:"text",className:"direct-link",readOnly:!0,value:"".concat(window.location.href.replace(/#.*/,""),"#").concat(encodeURIComponent(this.state.input))}))))),s.a.createElement("section",{className:"App-body"},s.a.createElement("div",{className:"display-container"},s.a.createElement("p",{className:"description"},"interpreted as"),e)))}}]),t}(s.a.Component),ae=Object(y.a)(te),ne=a(365),re=a(368);c.a.render(s.a.createElement(re.a,null,s.a.createElement(ne.a,{path:"/",component:ae})),document.getElementById("root"))}},[[158,2,1]]]);
//# sourceMappingURL=main.44e604d4.chunk.js.map