(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-dd9333fe"],{7794:function(e,t,a){},b017:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("editor",e._g(e._b({attrs:{"api-key":"jz9zw066y1twsoyxdauivnsw1soymo6l7vi9om94g7ijszt4",initialValue:"",init:{selector:"textarea#image-tools",height:500,plugins:["advlist autolink lists link image charmap print preview anchor","searchreplace visualblocks code fullscreen","insertdatetime media table paste imagetools wordcount"],toolbar:"insertfile undo redo | styleselect | fontsizeselect bold italic | image media | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link",image_title:!0,automatic_uploads:!0,file_picker_types:"image",file_picker_callback:this.uploader,content_style:"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"}}},"editor",e.$attrs,!1),e.$listeners))},i=[],r=(a("b0c0"),a("ac1f"),a("1276"),a("ca72")),o={name:"TinyEditor",components:{editor:r["a"]},data:function(){return{useDarkMode:window.matchMedia("(prefers-color-scheme: dark)").matches,document:document}},methods:{uploader:function(e,t,a){var n=document.createElement("input");n.setAttribute("type","file"),n.setAttribute("accept","image/*"),n.onchange=function(){var t=this.files[0],a=new FileReader;a.onload=function(){var n="blobid"+(new Date).getTime(),i=window.tinymce.activeEditor.editorUpload.blobCache,r=a.result.split(",")[1],o=i.create(n,t,r);i.add(o),e(o.blobUri(),{title:t.name})},a.readAsDataURL(t)},n.click()}}},l=o,s=a("2877"),c=Object(s["a"])(l,n,i,!1,null,null,null);t["a"]=c.exports},e104:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("a-row",[a("a-col",{attrs:{span:12}},[a("a-breadcrumb",{staticStyle:{margin:"10px 5px"}},[a("a-breadcrumb-item",[a("router-link",{attrs:{to:"/banners/list"}},[e._v(e._s(e.$t("banners")))])],1),a("a-breadcrumb-item",[e._v(e._s(e.$t("add")))])],1)],1)],1),a("a-card",{attrs:{title:e.$t("fillIn")}},[a("a-row",[a("v-main")],1)],1)],1)},i=[],r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("a-switch",{staticStyle:{margin:"15px 0"},attrs:{slot:"extra","checked-children":e.$t("active"),"un-checked-children":e.$t("inactive"),"default-checked":""},slot:"extra",model:{value:e.banner.active,callback:function(t){e.$set(e.banner,"active",t)},expression:"banner.active"}}),a("a-form-model",{ref:"ruleForm",attrs:{model:e.banner,rules:e.rules,"label-col":e.labelCol,"wrapper-col":e.wrapperCol},on:{submit:e.onSubmit}},[a("a-row",[a("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:12}},[a("a-form-model-item",{ref:"title",attrs:{label:e.$t("title"),prop:"title"}},[a("a-input",{model:{value:e.banner.title,callback:function(t){e.$set(e.banner,"title",t)},expression:"banner.title"}})],1)],1),a("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:12}},[a("a-form-model-item",{ref:"url",attrs:{label:e.$t("url"),prop:"url"}},[a("a-input",{model:{value:e.banner.url,callback:function(t){e.$set(e.banner,"url",t)},expression:"banner.url"}})],1)],1),a("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:24}},[a("a-form-model-item",{ref:"slug",attrs:{label:e.$t("bannerPosition"),prop:"slug"}},[a("a-select",{attrs:{"show-search":"","auto-clear-search-value":!1,"filter-option":!1,placeholder:"Banner"},on:{search:e.onBannerPositionSearch,change:e.handleBannerPositionChange},model:{value:e.banner.position,callback:function(t){e.$set(e.banner,"position",t)},expression:"banner.position"}},e._l(e.bannerPos,(function(t){return a("a-select-option",{key:t.id,attrs:{title:t.title,value:t.id}},[e._v(" "+e._s(t.title+" ("+t.size+")")+" ")])})),1)],1)],1),a("a-col",{style:{minHeight:"180px",padding:"0 15px"},attrs:{span:24}},[a("a-form-item",{attrs:{label:e.$t("uploadImage")}},[a("a-upload",{staticClass:"avatar-uploader",attrs:{"custom-request":e.uploadImage,"list-type":"picture-card","show-upload-list":!1}},[e.imageUrl?a("img",{staticClass:"uploaded-image",attrs:{src:e.imageUrl,alt:"avatar"}}):a("div",[a("a-icon",{attrs:{type:e.loading?"loading":"plus"}}),a("div",{staticClass:"ant-upload-text"},[e._v(" "+e._s(e.$t("uploadImage"))+" ")])],1)])],1)],1),a("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:24}},[a("a-form-model-item",{ref:"description",attrs:{label:e.$t("description"),prop:"description"}},[a("tinymce",{model:{value:e.banner.description,callback:function(t){e.$set(e.banner,"description",t)},expression:"banner.description"}})],1)],1),a("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:24}},[a("a-form-model-item",[a("a-button",{attrs:{type:"primary","html-type":"submit"},on:{click:e.onSubmit}},[e._v(" "+e._s(e.$t("save"))+" ")]),a("a-button",{staticStyle:{"margin-left":"10px"},on:{click:e.resetForm}},[e._v(" "+e._s(e.$t("reset"))+" ")])],1)],1)],1)],1)],1)},o=[],l=(a("a4d3"),a("e01a"),a("d81d"),a("ac1f"),a("5319"),a("1276"),a("5530")),s=a("b775"),c=a("b017"),u=a("5880");function d(e,t){var a=new FileReader;a.addEventListener("load",(function(){return t(a.result)})),a.readAsDataURL(e)}var p={components:{tinymce:c["a"]},data:function(){return{bannerId:this.$route.params.id,labelCol:{span:24},wrapperCol:{span:24},loading:!1,bannerPos:[],banner:{active:!0,title:"",description:"",position:"",image:"",url:""},imageUrl:"",rules:{title:[{required:!0,message:this.$t("required"),trigger:"change"}]}}},mounted:function(){var e=this;this.bannerId&&this.getBannerAttrs(),this.getBannerPositions({page:null,search:!1}).then((function(t){e.bannerPos=e.bannerPositions})).catch((function(e){}))},computed:Object(l["a"])({},Object(u["mapGetters"])(["bannerPositions"])),methods:Object(l["a"])(Object(l["a"])({},Object(u["mapActions"])(["getBannerPositions"])),{},{getBannerAttrs:function(){var e=this;Object(s["b"])({url:"/banner/".concat(this.bannerId),method:"get"}).then((function(t){var a=t.banner,n=a.active,i=a.title,r=a.image,o=a.url,l=a.position,s=a.description;e.banner.active=n,e.banner.title=i,e.banner.description=s,e.banner.position=l.id,e.banner.image=r.split("/")[4],e.imageUrl=r,e.banner.url=o}))},handleBannerPositionChange:function(e){},onBannerPositionSearch:function(e){var t=this;Object(s["b"])({url:"/banner-position",method:"get",params:{search:e}}).then((function(e){t.bannerPos=[],e.positions.map((function(e){t.bannerPos.push({title:e.title,id:e.id})}))}))},onSubmit:function(e){var t=this;e.preventDefault(),this.$refs.ruleForm.validate((function(e){if(!e)return!1;var a="/banner",n="post";t.bannerId&&(a="/banner/".concat(t.bannerId),n="put");var i={"Content-Type":"application/json"};Object(s["b"])({url:a,method:n,data:t.banner,headers:i}).then((function(e){t.$router.replace("/banners/list")})).catch((function(e){t.$message.error(t.$t("error"))}))}))},resetForm:function(){this.$refs.ruleForm.resetFields()},onReady:function(e){e.ui.getEditableElement().parentElement.insertBefore(e.ui.view.toolbar.element,e.ui.getEditableElement())},uploadImage:function(e){var t=this;this.loading=!0;var a=new FormData;a.append("file",e.file),Object(s["b"])({url:"/upload",method:"post",data:a}).then((function(a){d(e.file,(function(e){t.imageUrl=e,t.loading=!1})),t.banner.image=a.filename})).catch((function(e){}))}})},m=p,b=(a("ff2f"),a("2877")),f=Object(b["a"])(m,r,o,!1,null,null,null),h=f.exports,g={components:{"v-main":h}},v=g,y=Object(b["a"])(v,n,i,!1,null,null,null);t["default"]=y.exports},ff2f:function(e,t,a){"use strict";var n=a("7794"),i=a.n(n);i.a}}]);