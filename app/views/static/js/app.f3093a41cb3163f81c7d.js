webpackJsonp([1],{"7zck":function(t,e){},AgrG:function(t,e){},CLYB:function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("7+uW"),s={render:function(){var t=this.$createElement;return(this._self._c||t)("router-view")},staticRenderFns:[]},l=a("VU/8")({data:function(){return{clipped:!1,drawer:!0,fixed:!1,items:[{icon:"bubble_chart",title:"Inspire"}],miniVariant:!1,right:!0,rightDrawer:!1,title:"Vuetify.js"}},name:"App"},s,!1,null,null,null).exports,r=a("/ocq"),i={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-app",{attrs:{dark:""}},[a("v-container",{attrs:{fluid:"","fill-height":"","grid-list-md":""}},[a("v-layout",{attrs:{row:"",wrap:"","justify-center":"","align-center":""}},[a("v-flex",{staticClass:"xs12 sm6 md4 lg4 lx4"},[a("v-card",[a("v-container",{attrs:{fluid:""}},[a("v-form",{ref:"form"},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:""}},[a("v-text-field",{attrs:{label:"Pasword","solo-inverted":"",rules:[function(t){return!!t||" Required"}]},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],1),t._v(" "),a("v-flex",{attrs:{xs12:""}},[a("v-btn",{attrs:{flat:"",color:"deep-orange",block:""},on:{click:t.auth}},[t._v("Auth")])],1)],1)],1)],1)],1)],1)],1),t._v(" "),a("v-snackbar",{attrs:{timeout:2e3,top:""},model:{value:t.errorAuth,callback:function(e){t.errorAuth=e},expression:"errorAuth"}},[t._v("\n\n          wrong password\n          "),a("v-btn",{attrs:{color:"deep-orange",flat:""},on:{click:function(e){t.errorAuth=!1}}},[t._v("\n              Close\n          ")])],1)],1)],1)},staticRenderFns:[]};var c=a("VU/8")({data:function(){return{password:null,errorAuth:!1}},methods:{auth:function(){this.$refs.form.validate()&&(this.$store.commit("auth",this.password),this.$store.state.auth?this.$router.push("/"):this.errorAuth=!0)}}},i,!1,function(t){a("AgrG")},null,null).exports,o=a("NYxO"),h=a("mtWM"),d=a.n(h);const u="http://localhost:5000",v=123321;n.default.use(o.a);const f=new o.a.Store({state:{auth:!1,password:123321,popup:!1,editChannel:null,deleteChannel:null,channelsWithPackage:null,categories:[{id:1,name:"Kids"}],packages:null,channels:null},mutations:{popup(t,e){t.popup=e},setChannels(t,e){t.channels=e.channels,t.channelsWithPackage=e.channelsWithPackage},editChannel(t,e){t.editChannel=t.channels.find(t=>t.channelId==e)},deleteChannel(t,e){t.deleteChannel=t.channels.find(t=>t.id==e)},auth(t,e){console.log(e),t.password==e&&(t.auth=!0)}},actions:{createNewChannel({state:t,commit:e,dispatch:a},n){n.dashboard=v,d.a.post(`${u}/createChannel`,n).then(t=>{201==t.status&&a("getChannels").then(t=>{})}).catch(t=>{console.log(t)})},getChannels({state:t,commit:e}){d.a.post(`${u}/allChannels`,{dashboard:v}).then(t=>{console.log(t.data),e("setChannels",t.data)})},getDeleteChannel({state:t,commit:e,dispatch:a}){const n=t.deleteChannel;n.dashboard=v,d.a.post(`${u}/deleteChannel`,n).then(()=>{a("getChannels")})},getUpdateChannel({state:t,commit:e,dispatch:a},n){n.dashboard=v,d.a.post(`${u}/updateChannel`,n).then(()=>{a("getChannels")})},getCategories({state:t,commit:e,dispatch:a}){d.a.post(`${u}/getCategories`,{dashboard:v}).then(e=>{t.categories=e.data})},getPackages({state:t,commit:e,dispatch:a}){d.a.post(`${u}/getPackages`,{dashboard:v}).then(e=>{t.packages=e.data})},createNewPackage({state:t,commit:e,dispatch:a},n){d.a.post(`${u}/addPackage`,{name:n,dashboard:v}).then(t=>{a("getPackages")})},deleteChannelFromPackage({state:t,commit:e,dispatch:a},n){n.dashboard=v,d.a.post(`${u}/deleteFromPackage`,n).then(()=>{a("getChannels")})},sortChannels({state:t,commit:e,dispatch:a},n){d.a.post(`${u}/sortChannels`,{channels:n,dashboard:v}).then(()=>{a("getChannels")})},addChannelToPackage({state:t,commit:e,dispatch:a},n){n.dashboard=v,d.a.post(`${u}/addChannelToPackage`,n).then(t=>{a("getChannels")})}}});var m={props:{data:{type:Object,required:!0}},data:function(){return{channelId:null,channelName:null,channelNameENG:null,xmltvid:null,category:null,packageId:null,logoPath:null,streamPath:null,timeshift:null,hidden:null}},computed:{categories:function(){return this.$store.state.categories},packages:function(){return this.$store.state.packages}},methods:{init:function(){this.channelId=this.data.channelId,this.channelName=this.data.channelName,this.channelNameENG=this.data.channelNameEn,this.xmltvid=this.data.xmlTvId,this.category=this.data.categoryId,this.package=this.data.package,this.logoPath=this.data.logoPath,this.streamPath=this.data.streamPath,this.timeshift=this.data.timeshift,this.hidden=this.hidden},close:function(){this.$store.state.editChannel=null,this.$store.commit("popup",!1)},apply:function(){var t=this;if(this.$refs.form.validate()){var e={channelId:this.channelId,channelName:this.channelName,channelNameENG:this.channelNameENG,xmlTvId:this.xmltvid,categoryId:this.category,logoPath:this.logoPath,streamPath:this.streamPath,timeshift:this.timeshift,hidden:this.hidden?1:0};this.$store.dispatch("getUpdateChannel",e).then(function(){t.$refs.form.reset(),t.$store.state.editChannel=null,t.$store.commit("popup",!1)})}}},watch:{data:function(){this.init()}},mounted:function(){this.init()}},p={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:"","grid-list-lg":""}},[a("v-form",{ref:"form"},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{"text-xs-center":"",xs12:""}},[a("h1",{staticClass:"title"},[t._v("\n          edit channel: "),a("span",{staticClass:"deep-orange--text"},[t._v("\n            "+t._s(t.data.channelName)+"\n          ")])])]),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"Channel ID",rules:[function(t){return!!t||"Required"}]},model:{value:t.channelId,callback:function(e){t.channelId=e},expression:"channelId"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"Channel name",rules:[function(t){return!!t||"Required"}]},model:{value:t.channelName,callback:function(e){t.channelName=e},expression:"channelName"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"Channel name ENG",rules:[function(t){return!!t||"Required"}]},model:{value:t.channelNameENG,callback:function(e){t.channelNameENG=e},expression:"channelNameENG"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"XML tv ID",rules:[function(t){return!!t||"Required"}]},model:{value:t.xmltvid,callback:function(e){t.xmltvid=e},expression:"xmltvid"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-select",{attrs:{items:t.categories,"item-text":"name","item-value":"id",label:"Category",rules:[function(t){return!!t||"Required"}]},model:{value:t.category,callback:function(e){t.category=e},expression:"category"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"Logo path",rules:[function(t){return!!t||"Required"}]},model:{value:t.logoPath,callback:function(e){t.logoPath=e},expression:"logoPath"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"Stream path",rules:[function(t){return!!t||"Required"}]},model:{value:t.streamPath,callback:function(e){t.streamPath=e},expression:"streamPath"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"timeshift",rules:[function(t){return!!t||"Required"}]},model:{value:t.timeshift,callback:function(e){t.timeshift=e},expression:"timeshift"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-checkbox",{attrs:{label:"hidden"},model:{value:t.hidden,callback:function(e){t.hidden=e},expression:"hidden"}})],1),t._v(" "),a("v-flex",{attrs:{xs12:""}}),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-btn",{attrs:{color:"warning",flat:"",block:""},on:{click:function(e){t.close()}}},[t._v(" reset")])],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-btn",{attrs:{color:"success",flat:"",block:""},on:{click:function(e){t.apply()}}},[t._v(" apply")])],1)],1)],1)],1)},staticRenderFns:[]};var x=a("VU/8")(m,p,!1,function(t){a("UiRY")},null,null).exports,g={props:{data:{type:Object,required:!0}},methods:{cencel:function(){this.$store.state.deleteChannel=null,this.$store.commit("popup",!1)},deleteChannel:function(){var t=this;this.$store.dispatch("getDeleteChannel",this.data.id).then(function(){t.$store.state.deleteChannel=null,t.$store.commit("popup",!1)})}}},_={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:"","grid-list-lg":""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:"","text-xs-center":""}},[a("h1",{staticClass:"body-3"},[t._v("Are you sure delete channel:  "),a("span",{staticClass:"deep-orange--text"},[t._v(t._s(t.data.channelName))]),t._v(" ?")])]),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-btn",{attrs:{block:"",color:"warning",flat:""},on:{click:function(e){t.cencel()}}},[t._v("cencel")])],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-btn",{attrs:{block:"",color:"error",flat:""},on:{click:function(e){t.deleteChannel()}}},[t._v("Delete")])],1)],1)],1)},staticRenderFns:[]};var k={components:{editChannel:x,deleteChannel:a("VU/8")(g,_,!1,function(t){a("aAQn")},null,null).exports},data:function(){return{}},computed:{popup:function(){return this.$store.state.popup}},created:function(){this.$store.dispatch("getChannels"),this.$store.dispatch("getCategories"),this.$store.dispatch("getPackages")}},C={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-app",{attrs:{dark:""}},[a("v-toolbar",{staticClass:"deep-orange",attrs:{dense:"",app:"",flat:""}},[a("v-toolbar-items",[a("v-btn",{attrs:{flat:"",to:"/channels"}},[t._v("Channels")]),t._v(" "),a("v-btn",{attrs:{flat:"",to:"/packages"}},[t._v("packages")])],1)],1),t._v(" "),a("v-container",{attrs:{fluid:"","fill-height":""}},[a("v-layout",{attrs:{row:"",wrap:"","justify-center":"","align-center":""}},[a("router-view")],1)],1),t._v(" "),a("v-dialog",{attrs:{persistent:"",width:"80%"},model:{value:t.popup,callback:function(e){t.popup=e},expression:"popup"}},[a("v-card",[null!==t.$store.state.editChannel?a("edit-channel",{attrs:{data:t.$store.state.editChannel}}):t._e(),t._v(" "),null!==t.$store.state.deleteChannel?a("delete-channel",{attrs:{data:t.$store.state.deleteChannel}}):t._e()],1)],1)],1)},staticRenderFns:[]};var b=a("VU/8")(k,C,!1,function(t){a("mJN+")},null,null).exports,w={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-flex",{attrs:{xs12:""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:"","text-xs-right":""}},[a("v-btn",{attrs:{flat:"",color:"success",to:"/channels/new"}},[t._v("new Channel")])],1),t._v(" "),a("v-flex",{attrs:{xs12:""}},[a("v-data-table",{staticClass:"elevation-1",attrs:{dark:"",headers:t.headers,items:t.items,"hide-actions":""},scopedSlots:t._u([{key:"items",fn:function(e){return[a("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.channelId))]),t._v(" "),a("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.channelName))]),t._v(" "),a("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.channelNameEn))]),t._v(" "),a("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.xmlTvId))]),t._v(" "),a("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.categoryId))]),t._v(" "),a("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.logoPath))]),t._v(" "),a("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.streamPath))]),t._v(" "),a("td",{staticClass:"text-xs-left"},[t._v(t._s(e.item.timeshift))]),t._v(" "),a("td",{staticClass:"text-xs-left"},[a("v-icon",[t._v(t._s(e.item.hidden?"done":"clear")+" ")])],1),t._v(" "),a("td",{staticClass:"text-xs-left"},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs6:""}},[a("v-btn",{attrs:{flat:"",small:""},on:{click:function(a){t.edit(e.item.channelId)}}},[a("v-icon",{attrs:{color:"warning"}},[t._v("edit")])],1)],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-btn",{attrs:{small:"",flat:""},on:{click:function(a){t.deleteChannel(e.item.id)}}},[a("v-icon",{attrs:{color:"error"}},[t._v("clear")])],1)],1)],1)],1)]}}])})],1)],1)],1)},staticRenderFns:[]};var N=a("VU/8")({data:function(){return{headers:[{text:"Channel ID",value:"channelId",width:"5%"},{text:"Channel name",value:"channelName",width:"10%"},{text:"Channel name EN",value:"channelNameENG",width:"10%"},{text:"XML TV ID",value:"xmlTvId",width:"10%"},{text:"Category",value:"categoryId",width:"10%"},{text:"Logo path",value:"logopPath",width:"10%"},{text:"Stream path",value:"streamPath",width:"10%"},{text:"Timeshift",value:"timeshift",width:"5%"},{text:"hidden",value:"hidden",width:"5%"},{text:"",value:"",sortable:!1,width:"12%"}]}},methods:{newChannel:function(){this.$store.commit("addNewChannel")},edit:function(t){this.$store.commit("editChannel",t),this.$store.commit("popup",!0)},deleteChannel:function(t){this.$store.commit("deleteChannel",t),this.$store.commit("popup",!0)}},computed:{items:function(){return this.$store.state.channels||[]}}},w,!1,function(t){a("vilB")},null,null).exports,y={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:"","grid-list-lg":""}},[a("v-form",{ref:"form"},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:"","text-xs-center":""}},[a("h1",{staticClass:"title"},[t._v("\n                create new Channel\n            ")])]),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"Channel ID",rules:[function(t){return!!t||"Required"}]},model:{value:t.channelId,callback:function(e){t.channelId=e},expression:"channelId"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"Channel name",rules:[function(t){return!!t||"Required"}]},model:{value:t.channelName,callback:function(e){t.channelName=e},expression:"channelName"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"Channel name ENG",rules:[function(t){return!!t||"Required"}]},model:{value:t.channelNameENG,callback:function(e){t.channelNameENG=e},expression:"channelNameENG"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"XML tv ID",rules:[function(t){return!!t||"Required"}]},model:{value:t.xmltvid,callback:function(e){t.xmltvid=e},expression:"xmltvid"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-select",{attrs:{items:t.categories,"item-text":"name","item-value":"id",label:"Category",rules:[function(t){return!!t||"Required"}]},model:{value:t.category,callback:function(e){t.category=e},expression:"category"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"Logo path",rules:[function(t){return!!t||"Required"}]},model:{value:t.logoPath,callback:function(e){t.logoPath=e},expression:"logoPath"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"Stream path",rules:[function(t){return!!t||"Required"}]},model:{value:t.streamPath,callback:function(e){t.streamPath=e},expression:"streamPath"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-text-field",{attrs:{label:"timeshift",rules:[function(t){return!!t||"Required"}]},model:{value:t.timeshift,callback:function(e){t.timeshift=e},expression:"timeshift"}})],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-checkbox",{attrs:{label:"hidden"},model:{value:t.hidden,callback:function(e){t.hidden=e},expression:"hidden"}})],1),t._v(" "),a("v-flex",{attrs:{xs12:""}}),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-btn",{attrs:{color:"warning",flat:"",block:""},on:{click:function(e){t.close()}}},[t._v(" reset")])],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-btn",{attrs:{color:"success",flat:"",block:""},on:{click:function(e){t.apply()}}},[t._v(" apply")])],1)],1)],1)],1)},staticRenderFns:[]};var P=a("VU/8")({data:function(){return{channelId:null,channelName:null,channelNameENG:null,xmltvid:null,category:null,packageId:null,logoPath:null,streamPath:null,timeshift:null,hidden:null}},computed:{categories:function(){return this.$store.state.categories},packages:function(){return this.$store.state.packages}},methods:{apply:function(){var t=this;if(this.$refs.form.validate()){var e={channelId:this.channelId,channelName:this.channelName,channelNameENG:this.channelNameENG,xmlTvId:this.xmltvid,categoryId:this.category,logoPath:this.logoPath,streamPath:this.streamPath,timeshift:this.timeshift,hidden:this.hidden?1:0};this.$store.dispatch("createNewChannel",e).then(function(){t.$refs.form.reset(),t.$router.push("/")})}}}},y,!1,function(t){a("CLYB")},null,null).exports,$=a("DAYN"),I=a.n($),E={components:{draggable:I.a},data:function(){return{activePackage:null,channels:[]}},methods:{update:function(){var t=this;if(null!==this.activePackage&&0!==this.channels.length){var e=this.channels.map(function(e,a){return{channelId:e.id,packageId:t.activePackage,order:a}});this.$store.dispatch("sortChannels",e).then()}},deleteChannel:function(t){var e=this,a={channelId:t,packageId:this.activePackage};this.$store.dispatch("deleteChannelFromPackage",{channel:a}).then(function(){e.channels=e.channelsWithPackage.filter(function(t){return t.packageId==e.activePackage})})}},watch:{activePackage:function(t){var e=this;this.channels=this.channelsWithPackage.filter(function(t){return t.packageId==e.activePackage})}},computed:Object(o.b)({packages:function(t){return t.packages},channelsWithPackage:function(t){return t.channelsWithPackage.sort(function(t,e){return t.order-e.order})}})},R={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-layout",{attrs:{row:"",wrap:"","justify-center":"","align-center":""}},[a("v-flex",{attrs:{xs12:"",md6:""}},[a("v-flex",{attrs:{xs12:"","text-xs-right":""}},[a("v-btn",{attrs:{to:"/packages/new",color:"success",flat:""}},[t._v("new Package")]),t._v(" "),a("v-btn",{attrs:{flat:"",color:"success",disabled:!t.activePackage,to:"/packages/addChannels/"+t.activePackage}},[t._v("add channels to package")])],1),t._v(" "),a("v-flex",{attrs:{xs12:""}},[a("v-card",[a("v-container",{attrs:{fluid:"","grid-list-lg":""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:""}},[a("v-select",{attrs:{items:t.packages,"item-text":"name","item-value":"id","solo-inverted":""},model:{value:t.activePackage,callback:function(e){t.activePackage=e},expression:"activePackage"}})],1),t._v(" "),a("v-flex",{attrs:{xs12:""}},[a("v-btn",{attrs:{block:"",flat:"",color:"warning"},on:{click:t.update}},[t._v(" update")])],1)],1)],1)],1)],1),t._v(" "),a("draggable",{attrs:{options:{group:"people"}},on:{start:function(e){t.drag=!0},end:function(e){t.drag=!1}},model:{value:t.channels,callback:function(e){t.channels=e},expression:"channels"}},[t._l(t.channels,function(e,n){return[a("v-flex",{key:n,staticClass:"px-0 py-0 mx-0 my-0",attrs:{xs12:""}},[a("v-card",{staticClass:"my-3 mx-2",attrs:{light:""}},[a("v-container",{attrs:{fluid:"","px-2":"","py-2":""}},[a("v-layout",[a("v-flex",{attrs:{xs10:"","align-center":""}},[a("h1",{staticClass:"title mt-2 font-weight-medium grey--text"},[t._v("Channel ID :  "),a("span",{staticClass:"deep-orange--text"},[t._v(t._s(e.channelId))]),t._v(" Channel Name:\n                                           "),a("span",{staticClass:"deep-orange--text"},[t._v(t._s(e.channelName))])])]),t._v(" "),a("v-flex",{attrs:{xs2:"","text-xs-right":""}},[a("v-btn",{attrs:{flat:"",small:""},on:{click:function(a){t.deleteChannel(e.id)}}},[a("v-icon",{attrs:{color:"error"}},[t._v("clear")])],1)],1)],1)],1)],1)],1)]})],2)],1)],1)},staticRenderFns:[]};var q=a("VU/8")(E,R,!1,function(t){a("nxeV")},null,null).exports,L={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:"","grid-list-lg":""}},[a("v-form",{ref:"form"},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:"",sm10:""}},[a("v-text-field",{attrs:{label:"name","solo-inverted":"",rules:[function(t){return!!t||"Required"}]},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}})],1),t._v(" "),a("v-flex",{attrs:{xs12:"",sm2:""}},[a("v-btn",{attrs:{flat:"",color:"success"},on:{click:t.create}},[t._v("Apply")])],1)],1)],1)],1)},staticRenderFns:[]};var A=a("VU/8")({data:function(){return{name:null}},methods:{create:function(){var t=this;this.$refs.form.validate()&&this.$store.dispatch("createNewPackage",this.name).then(function(){t.$refs.form.reset(),t.$router.push("/")})}}},L,!1,function(t){a("VNXv")},null,null).exports,G={components:{draggable:I.a},props:["id"],data:function(){return{newList:[]}},methods:{apply:function(){var t=this;if(0!==this.newList.length){var e=this.newList.map(function(e,a){return{channelId:e.id,packageId:t.id,order:a}});console.log(e),this.$store.dispatch("addChannelToPackage",{channels:e}).then(function(e){t.newList=[],t.$router.go(-1)})}},clear:function(t){var e=this.newList.findIndex(function(e){if(e.channelName==t)return e});-1!==e&&(this.newList.splice(e,1),console.log(this.channelsList))},cencel:function(){this.newList=[],this.$router.go(-1)}},computed:{packageName:function(){var t=this;return this.$store.state.packages.find(function(e){return e.id==t.id}).name},getChannels:{get:function(){var t=this,e=this.channelsWithPackage.filter(function(e){if(e.packageId==t.id)return!0});return this.channels.filter(function(a){if(void 0===e.find(function(t){if(a.channelId==t.channelId)return!0})&&!t.newList.includes(a))return!0})},set:function(t){}},channels:{get:function(){return this.$store.state.channels}},channelsWithPackage:function(){return this.$store.state.channelsWithPackage}},mounted:function(){}},V={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:"","grid-list-lg":""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:"","text-xs-center":""}},[a("h1",{staticClass:"headline"},[t._v("\r\n                Add Channels to Package: "),a("span",{staticClass:"deep-orange--text"},[t._v(t._s(t.packageName))])])]),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-card",[a("draggable",{attrs:{options:{group:{name:"people",pull:"clone",put:!1}}},on:{start:function(e){t.drag=!0},end:function(e){t.drag=!1}},model:{value:t.getChannels,callback:function(e){t.getChannels=e},expression:"getChannels"}},[t._l(t.getChannels,function(e){return[a("v-flex",{key:e.channelId,attrs:{xs12:""}},[a("v-card",{staticClass:"my-3 mx-2",attrs:{light:""}},[a("v-container",{attrs:{fluid:"","px-2":"","py-2":""}},[a("v-layout",[a("v-flex",{attrs:{xs10:"","align-center":""}},[a("h1",{staticClass:"title mt-2 font-weight-medium grey--text"},[t._v("Channel ID :  "),a("span",{staticClass:"deep-orange--text"},[t._v(t._s(e.channelId))]),t._v(" Channel Name:\r\n                                                "),a("span",{staticClass:"deep-orange--text"},[t._v(t._s(e.channelName))])])]),t._v(" "),a("v-flex",{attrs:{xs2:"","text-xs-right":""}})],1)],1)],1)],1)]})],2)],1)],1),t._v(" "),a("v-flex",{attrs:{xs6:""}},[a("v-card",[a("draggable",{staticStyle:{"min-height":"450px"},attrs:{options:{group:"people"}},on:{start:function(e){t.drag=!0},end:function(e){t.drag=!1}},model:{value:t.newList,callback:function(e){t.newList=e},expression:"newList"}},[t._l(t.newList,function(e){return[a("v-flex",{key:e.channelId,attrs:{xs12:""}},[a("v-card",{staticClass:"my-3 mx-2",attrs:{light:""}},[a("v-container",{attrs:{fluid:"","px-2":"","py-2":""}},[a("v-layout",[a("v-flex",{attrs:{xs10:"","align-center":""}},[a("h1",{staticClass:"title mt-2 font-weight-medium grey--text"},[t._v("Channel ID :  "),a("span",{staticClass:"deep-orange--text"},[t._v(t._s(e.channelId))]),t._v(" Channel Name:\r\n                                                "),a("span",{staticClass:"deep-orange--text"},[t._v(t._s(e.channelName))])])]),t._v(" "),a("v-flex",{attrs:{xs2:"","text-xs-right":""}},[a("v-btn",{attrs:{flat:"",small:""}},[a("v-icon",{attrs:{color:"error"},on:{click:function(a){t.clear(e.channelName)}}},[t._v("clear")])],1)],1)],1)],1)],1)],1)]})],2)],1)],1),t._v(" "),a("v-flex",{attrs:{xs12:"","text-xs-right":""}},[a("v-btn",{attrs:{flat:"",color:"warning"},on:{click:function(e){t.cencel()}}},[t._v("cencel")]),t._v(" "),a("v-btn",{attrs:{flat:"",color:"success"},on:{click:function(e){t.apply()}}},[t._v("apply")])],1)],1)],1)},staticRenderFns:[]};var D=a("VU/8")(G,V,!1,function(t){a("zeyX")},null,null).exports;n.default.use(r.a);var F=new r.a({routes:[{path:"/auth",name:"Auth",component:c},{path:"/",name:"Dashboard",component:b,beforeEnter:function(t,e,a){f.state.auth?a():a("/auth")},children:[{path:"channels",name:"channels",component:N},{path:"channels/new",component:P},{path:"packages",name:"packages",component:q},{path:"packages/addChannels/:id",props:!0,component:D},{path:"packages/new",component:A},{path:"*",component:N}]}]}),U=a("3EgV"),W=a.n(U);a("7zck");n.default.use(W.a,{theme:{primary:"#FF6D00"}}),n.default.config.productionTip=!1,new n.default({el:"#app",router:F,store:f,components:{App:l},template:"<App/>"})},UiRY:function(t,e){},VNXv:function(t,e){},aAQn:function(t,e){},"mJN+":function(t,e){},nxeV:function(t,e){},vilB:function(t,e){},zeyX:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.f3093a41cb3163f81c7d.js.map