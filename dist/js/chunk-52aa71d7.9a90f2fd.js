(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-52aa71d7"],{1356:function(t,e,i){},"2fcc1":function(t,e,i){"use strict";var n=i("1356"),a=i.n(n);a.a},b017:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("editor",t._g(t._b({attrs:{inline:"","api-key":"jz9zw066y1twsoyxdauivnsw1soymo6l7vi9om94g7ijszt4",initialValue:"",init:{selector:"textarea#image-tools",height:500,plugins:["advlist autolink lists link image charmap print preview anchor","searchreplace visualblocks code fullscreen","insertdatetime media table paste imagetools wordcount"],toolbar:"insertfile undo redo | styleselect | fontsizeselect bold italic | image media | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link",image_title:!0,automatic_uploads:!0,file_picker_types:"image",file_picker_callback:this.uploader,content_style:"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"}}},"editor",t.$attrs,!1),t.$listeners))},a=[],o=(i("b0c0"),i("ac1f"),i("1276"),i("ca72")),r={name:"TinyEditor",components:{editor:o["a"]},data:function(){return{useDarkMode:window.matchMedia("(prefers-color-scheme: dark)").matches,document:document}},methods:{uploader:function(t,e,i){var n=document.createElement("input");n.setAttribute("type","file"),n.setAttribute("accept","image/*"),n.onchange=function(){var e=this.files[0],i=new FileReader;i.onload=function(){var n="blobid"+(new Date).getTime(),a=window.tinymce.activeEditor.editorUpload.blobCache,o=i.result.split(",")[1],r=a.create(n,e,o);a.add(r),t(r.blobUri(),{title:e.name})},i.readAsDataURL(e)},n.click()}}},s=r,l=i("2877"),c=Object(l["a"])(s,n,a,!1,null,null,null);e["a"]=c.exports},b86c:function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("a-row",[i("a-col",{attrs:{span:12}},[i("a-breadcrumb",{staticStyle:{margin:"10px 5px"}},[i("a-breadcrumb-item",[i("router-link",{attrs:{to:"/banner-positions/list"}},[t._v(t._s(t.$t("bannerPositions")))])],1),i("a-breadcrumb-item",[t._v(t._s(t.$t("add")))])],1)],1)],1),i("a-card",{attrs:{title:t.$t("fillIn")}},[i("a-row",[i("v-main")],1)],1)],1)},a=[],o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("a-switch",{staticStyle:{margin:"15px 0"},attrs:{slot:"extra","checked-children":t.$t("active"),"un-checked-children":t.$t("inactive"),"default-checked":""},slot:"extra",model:{value:t.bannerPosition.active,callback:function(e){t.$set(t.bannerPosition,"active",e)},expression:"bannerPosition.active"}}),i("a-form-model",{ref:"ruleForm",attrs:{model:t.bannerPosition,rules:t.rules,"label-col":t.labelCol,"wrapper-col":t.wrapperCol},on:{submit:t.onSubmit}},[i("a-row",[i("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:12}},[i("a-form-model-item",{ref:"title",attrs:{label:t.$t("title"),prop:"title"}},[i("a-input",{model:{value:t.bannerPosition.title,callback:function(e){t.$set(t.bannerPosition,"title",e)},expression:"bannerPosition.title"}})],1)],1),i("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:12}},[i("a-form-model-item",{ref:"slug",attrs:{label:t.$t("url"),prop:"slug"}},[i("a-input",{attrs:{disabled:t.bannerPositionId},model:{value:t.bannerPosition.slug,callback:function(e){t.$set(t.bannerPosition,"slug",e)},expression:"bannerPosition.slug"}})],1)],1),i("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:12}},[i("a-form-model-item",{ref:"size",attrs:{label:t.$t("size"),prop:"size"}},[i("a-input",{model:{value:t.bannerPosition.size,callback:function(e){t.$set(t.bannerPosition,"size",e)},expression:"bannerPosition.size"}})],1)],1),i("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:24}},[i("a-form-model-item",{ref:"description",attrs:{label:t.$t("description"),prop:"description"}},[i("tinymce",{model:{value:t.bannerPosition.description,callback:function(e){t.$set(t.bannerPosition,"description",e)},expression:"bannerPosition.description"}})],1)],1),i("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:24}},[i("a-form-model-item",[i("a-button",{attrs:{type:"primary","html-type":"submit"},on:{click:t.onSubmit}},[t._v(" "+t._s(t.$t("save"))+" ")]),i("a-button",{staticStyle:{"margin-left":"10px"},on:{click:t.resetForm}},[t._v(" "+t._s(t.$t("reset"))+" ")])],1)],1)],1)],1)],1)},r=[],s=(i("a4d3"),i("e01a"),i("ac1f"),i("5319"),i("5530")),l=i("b775"),c=i("b017"),u={components:{tinymce:c["a"]},data:function(){return{bannerPositionId:this.$route.params.id,labelCol:{span:24},wrapperCol:{span:24},loading:!1,bannerPosition:{title:"",size:"",description:"",slug:"",active:!0},rules:{title:[{required:!0,message:this.$t("required"),trigger:"change"}],slug:[{required:!0,message:this.$t("required"),trigger:"change"}]}}},mounted:function(){this.bannerPositionId&&this.getBannerPositionAttrs()},methods:{getBannerPositionAttrs:function(){var t=this;Object(l["b"])({url:"/banner-position/".concat(this.bannerPositionId),method:"get"}).then((function(e){var i=e.position,n=i.active,a=i.title,o=i.size,r=i.slug,s=i.description;t.bannerPosition.active=n,t.bannerPosition.title=a,t.bannerPosition.description=s,t.bannerPosition.size=o,t.bannerPosition.slug=r}))},onSubmit:function(t){var e=this;t.preventDefault(),this.$refs.ruleForm.validate((function(t){if(!t)return!1;var i="/banner-position",n="post";e.bannerPositionId&&(i="/banner-position/".concat(e.bannerPositionId),n="put");var a={"Content-Type":"application/json"};Object(l["b"])({url:i,method:n,data:Object(s["a"])({},e.bannerPosition),headers:a}).then((function(t){e.$router.replace("/banner-positions/list")})).catch((function(t){e.$message.error(e.$t("error"))}))}))},resetForm:function(){this.$refs.ruleForm.resetFields()},onReady:function(t){t.ui.getEditableElement().parentElement.insertBefore(t.ui.view.toolbar.element,t.ui.getEditableElement())}}},d=u,p=(i("2fcc1"),i("2877")),b=Object(p["a"])(d,o,r,!1,null,null,null),m=b.exports,f={components:{"v-main":m}},g=f,v=Object(p["a"])(g,n,a,!1,null,null,null);e["default"]=v.exports}}]);