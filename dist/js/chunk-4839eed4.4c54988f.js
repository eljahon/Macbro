(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4839eed4"],{"484c":function(t,e,a){},"51cc":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("a-row",[a("a-col",{attrs:{span:12}},[a("a-breadcrumb",{staticStyle:{margin:"10px 5px"}},[a("a-breadcrumb-item",[t._v(t._s(t.$t("pages")))])],1)],1),a("a-col",{attrs:{span:12}},[a("router-link",{attrs:{to:"././create"}},[a("a-button",{staticStyle:{float:"right"},attrs:{shape:"round",type:"primary link",icon:"plus"}},[t._v(t._s(t.$t("add")))])],1)],1)],1),a("a-card",{attrs:{title:t.$t("list")}},[a("div",{attrs:{slot:"extra"},slot:"extra"},[a("a-form",{attrs:{layout:"horizontal",form:t.form},on:{submit:t.search}},[a("a-row",[a("a-col",{staticStyle:{padding:"5px"},attrs:{span:24}},[a("a-form-item",{staticStyle:{margin:"0"}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["search",{initialValue:this.getSearchQuery}],expression:"['search', { initialValue: this.getSearchQuery }]"},{name:"debounce",rawName:"v-debounce",value:t.debouncedSearch,expression:"debouncedSearch"}],attrs:{id:"inputSearch",placeholder:t.$t("search")+"..."}})],1)],1)],1)],1)],1),a("a-table",{attrs:{columns:t.columns,rowKey:function(t){return t.id},dataSource:t.getAllPages,pagination:t.getPagination,loading:t.loading},on:{change:t.handleTableChange},scopedSlots:t._u([{key:"image",fn:function(t){return[a("img",{attrs:{src:t.preview_image,alt:"preview image"}})]}},{key:"status",fn:function(e){return[e?a("a-tag",{attrs:{color:"#108ee9"}},[t._v(" "+t._s(t.$t("active"))+" ")]):a("a-tag",{attrs:{color:"#f50"}},[t._v(" "+t._s(t.$t("inactive"))+" ")])]}},{key:"action",fn:function(e,n){return[a("a-tooltip",[a("template",{slot:"title"},[t._v(t._s(t.$t("read")))]),a("a-button",{attrs:{id:"buttonPreview",type:"default",icon:"eye"},on:{click:function(e){return t.showPreviewModal(n.slug)}}})],2),a("router-link",{attrs:{to:"./update/"+n.slug}},[a("a-tooltip",[a("template",{slot:"title"},[t._v(t._s(t.$t("update")))]),a("a-button",{attrs:{id:"buttonUpdate",type:"primary",icon:"edit"}})],2)],1),a("a-popconfirm",{attrs:{slot:"extra",placement:"topRight",title:t.$t("deleteMsg"),okText:t.$t("yes"),cancelText:t.$t("no")},on:{confirm:function(e){return t.deletePage(e,n.slug)}},slot:"extra"},[a("a-tooltip",[a("template",{slot:"title"},[t._v(t._s(t.$t("delete")))]),a("a-button",{attrs:{id:"buttonDelete",type:"danger",icon:"delete"}})],2)],1)]}}])})],1),t.selectedPage?a("a-modal",{attrs:{width:"800px",title:t.$t("previewBranch")},on:{cancel:t.handleCloseModal},model:{value:t.previewVisible,callback:function(e){t.previewVisible=e},expression:"previewVisible"}},[a("a-descriptions",{attrs:{layout:"horizontal",bordered:""}},[a("a-descriptions-item",{attrs:{span:24,label:t.$t("title")}},[t._v(" "+t._s(t.selectedPage.title)+" ")]),a("a-descriptions-item",{attrs:{span:24,label:t.$t("status")}},[t.selectedPage.active?a("a-tag",{attrs:{color:"#108ee9"}},[t._v(" "+t._s(t.$t("active"))+" ")]):a("a-tag",{attrs:{color:"#f50"}},[t._v(" "+t._s(t.$t("inactive"))+" ")])],1),a("a-descriptions-item",{attrs:{span:24,label:t.$t("preview_image")}},[a("img",{staticClass:"pages-image",attrs:{src:t.selectedPage.preview_image}})])],1),a("template",{slot:"footer"},[a("a-button",{key:"back",attrs:{id:"buttonCancel"},on:{click:t.handleCancel}},[t._v(" "+t._s(t.$t("cancel"))+" ")])],1)],2):t._e()],1)},i=[],s=(a("d3b7"),a("5530")),r=a("5880"),o=a("b775"),c={data:function(){return{value:"",data:[],loading:!0,columns:[{title:this.$t("title"),dataIndex:"title"},{title:this.$t("status"),dataIndex:"active",scopedSlots:{customRender:"status"}},{title:this.$t("action"),key:"action",width:"20%",scopedSlots:{customRender:"action"}}],form:this.$form.createForm(this,{name:"coordinated"}),previewVisible:!1,selectedPage:null,filterParams:{}}},computed:Object(s["a"])(Object(s["a"])({},Object(r["mapGetters"])(["pagesData","pagesPagination","searchQuery"])),{},{getPagination:function(){return this.pagesPagination},getAllPages:function(){return this.pagesData},getSearchQuery:function(){return this.searchQuery}}),mounted:function(){var t=this;this.loading=!0,this.getPages({page:this.pagesPagination}).then((function(){})).catch((function(e){t.$message.error(t.$t("error"))})).finally((function(){return t.loading=!1}))},methods:Object(s["a"])(Object(s["a"])({},Object(r["mapActions"])(["getPages","setSearchQuery"])),{},{handleTableChange:function(t){var e=this;this.loading=!0,this.getPages({page:t,search:!0}).then((function(t){})).catch((function(t){return e.requestFailed(t)})).finally((function(){return e.loading=!1}))},showPreviewModal:function(t){this.getSelectedPage(t),this.previewVisible=!0},getSelectedPage:function(t){var e=this;Object(o["b"])({url:"/page/".concat(t),method:"get"}).then((function(t){e.selectedPage=t.page}))},handleCancel:function(){this.previewVisible=!1},handleCloseModal:function(){this.selectedPage=null},debouncedSearch:function(t){var e=this;this.setSearchQuery(t),this.loading=!0,this.getPages().then((function(t){})).catch((function(t){return e.requestFailed(t)})).finally((function(){return e.loading=!1}))},deletePage:function(t,e){var a=this;this.loading=!0,Object(o["b"])({url:"/page/".concat(e),method:"delete"}).then((function(t){a.$message.success(a.$t("successfullyDeleted")),a.getPages({page:a.pagesPagination})})).catch((function(t){a.$message.error(a.$t("error"))})).finally((function(){return a.loading=!1}))},search:function(t){var e=this;t.preventDefault(),this.form.validateFields((function(t,a){e.loading=!0,t||(e.filterParams=a,e.getPages().then((function(t){})).catch((function(t){})).finally((function(){return e.loading=!1})))}))}})},l=c,u=(a("5e51"),a("2877")),d=Object(u["a"])(l,n,i,!1,null,null,null);e["default"]=d.exports},"5e51":function(t,e,a){"use strict";var n=a("484c"),i=a.n(n);i.a}}]);