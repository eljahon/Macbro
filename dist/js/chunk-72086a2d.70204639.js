(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-72086a2d"],{"6de1":function(a,e,t){},"975d":function(a,e,t){"use strict";var n=t("6de1"),r=t.n(n);r.a},f8a8:function(a,e,t){"use strict";t.r(e);var n=function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("div",[t("a-row",[t("a-col",{attrs:{span:12}},[t("a-breadcrumb",{staticStyle:{margin:"10px 5px"}},[t("a-breadcrumb-item",[t("router-link",{attrs:{to:"/admins/list"}},[a._v(a._s(a.$t("admins")))])],1),t("a-breadcrumb-item",[a._v(a._s(a.$t("add")))])],1)],1)],1),t("a-card",{attrs:{title:a.$t("fillIn")}},[t("a-row",[t("div",[t("a-form-model",{ref:"ruleForm",attrs:{model:a.admin,rules:a.rules,"label-col":a.labelCol,"wrapper-col":a.wrapperCol},on:{submit:a.onSubmit}},[t("a-row",[t("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:24}},[t("a-form-model-item",{ref:"name",attrs:{label:a.$t("firstName"),prop:"name"}},[t("a-input",{model:{value:a.admin.name,callback:function(e){a.$set(a.admin,"name",e)},expression:"admin.name"}})],1)],1),t("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:12}},[t("a-form-model-item",{ref:"username",attrs:{label:a.$t("username"),prop:"username"}},[t("a-input",{model:{value:a.admin.username,callback:function(e){a.$set(a.admin,"username",e)},expression:"admin.username"}})],1)],1),t("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:12}},[t("a-form-model-item",{ref:"phone",attrs:{label:a.$t("phone"),prop:"phone"}},[t("a-input",{attrs:{type:"tel"},model:{value:a.phone,callback:function(e){a.phone=e},expression:"phone"}})],1)],1),t("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:12}},[t("a-form-model-item",{ref:"password",attrs:{label:a.$t("password"),prop:"password"}},[t("a-input",{model:{value:a.admin.password,callback:function(e){a.$set(a.admin,"password",e)},expression:"admin.password"}})],1)],1),t("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:12}},[t("a-form-model-item",{ref:"confirmPassword",attrs:{label:a.$t("confirmPassword"),prop:"confirmPassword"}},[t("a-input",{model:{value:a.confirmPassword,callback:function(e){a.confirmPassword=e},expression:"confirmPassword"}})],1)],1),t("a-col",{staticStyle:{padding:"0 15px"},attrs:{span:24}},[t("a-form-model-item",[t("a-button",{attrs:{type:"primary","html-type":"submit"},on:{click:a.onSubmit}},[a._v(" "+a._s(a.$t("save"))+" ")]),t("a-button",{staticStyle:{"margin-left":"10px"},on:{click:a.resetForm}},[a._v(" "+a._s(a.$t("reset"))+" ")])],1)],1)],1)],1)],1)])],1)],1)},r=[],s=(t("b0c0"),t("ac1f"),t("5319"),t("5530")),o=t("b775"),i=t("8ded"),m=t.n(i),l=t("9fb0"),d={data:function(){return{adminId:this.$route.params.id,labelCol:{span:24},wrapperCol:{span:24},loading:!1,phone:"",permissions:null,confirmPassword:"",admin:{name:"",username:"",password:""},rules:{name:[{required:!0,message:this.$t("required"),trigger:"change"}]}}},mounted:function(){this.getAdminToken()},methods:{getAdminToken:function(){var a=this;Object(o["b"])({url:"/admin/profile",method:"get",headers:{Authorization:m.a.get(l["a"]),"Content-Type":"application/json"}}).then((function(e){var t=e.name,n=e.username,r=e.phone,s=e.permissions;a.admin.name=t,a.admin.username=n,a.phone=r,a.permissions=s})).catch((function(a){}))},onSubmit:function(a){var e=this;a.preventDefault(),this.$refs.ruleForm.validate((function(a){if(e.admin.password===e.confirmPassword){if(!a)return!1;var t="/admin/profile",n="put",r=Object(s["a"])(Object(s["a"])({},e.admin),{},{phone:e.phone});Object(o["b"])({url:t,method:n,data:r,headers:{Authorization:m.a.get(l["a"]),"Content-Type":"application/json"}}).then((function(a){e.$router.replace("/dashboard")})).catch((function(a){e.$message.error(e.$t("error"))}))}else e.$message.error(e.$t("passwordMatchError"))}))},resetForm:function(){this.$refs.ruleForm.resetFields()}}},p=d,c=(t("975d"),t("2877")),u=Object(c["a"])(p,n,r,!1,null,null,null);e["default"]=u.exports}}]);