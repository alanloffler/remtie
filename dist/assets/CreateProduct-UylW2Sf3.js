import{$ as pe,r as i,n as Y,o as ue,h as K,_ as j,k as be,l as De,x as he,H as ke,I as Te,J as d,m as Oe,j as e,p as Q,u as Ve,B as k,S as ae,t as _}from"./index-BCta2iwk.js";import{C as Me,S as re,a as oe,b as ne,c as le,d as ce}from"./select-CD5XDIEa.js";import{C as ie,d as Fe}from"./card-x1ywVH_7.js";import{D as Le,a as ze,b as Be,c as Ke,d as Ge,e as He}from"./dialog-Cbf9pZRL.js";import{u as de,f as fe,a as C,b as w,c as E,d as N,e as y,t as me}from"./zod-D9tdBR2H.js";import{I as V}from"./input-mh7JJ6NP.js";import{L as Ue}from"./label-D3hEH840.js";import{S as qe,g as Je,I as q}from"./image.services-CrBS0_lZ.js";import{T as Ye,p as Qe,i as We}from"./property.schema-CNfonr2l.js";import{B as Xe,C as Ze}from"./categories.services-BIRfYhm5.js";import{P as et}from"./products.services-ClCANeLJ.js";import{u as tt}from"./useCapitalize-CH2_f9x0.js";import{A as st}from"./arrow-left-CIgR4B0O.js";import{T as at}from"./trash-2-Fv-IyTXX.js";import"./index-BAguUWrr.js";const $e="Collapsible",[rt,ve]=pe($e),[ot,W]=rt($e),nt=i.forwardRef((t,o)=>{const{__scopeCollapsible:a,open:r,defaultOpen:c,disabled:n,onOpenChange:f,...m}=t,[b=!1,u]=Y({prop:r,defaultProp:c,onChange:f});return i.createElement(ot,{scope:a,disabled:n,contentId:ue(),open:b,onOpenToggle:i.useCallback(()=>u(h=>!h),[u])},i.createElement(K.div,j({"data-state":X(b),"data-disabled":n?"":void 0},m,{ref:o})))}),lt="CollapsibleTrigger",ct=i.forwardRef((t,o)=>{const{__scopeCollapsible:a,...r}=t,c=W(lt,a);return i.createElement(K.button,j({type:"button","aria-controls":c.contentId,"aria-expanded":c.open||!1,"data-state":X(c.open),"data-disabled":c.disabled?"":void 0,disabled:c.disabled},r,{ref:o,onClick:be(t.onClick,c.onOpenToggle)}))}),ge="CollapsibleContent",it=i.forwardRef((t,o)=>{const{forceMount:a,...r}=t,c=W(ge,t.__scopeCollapsible);return i.createElement(De,{present:a||c.open},({present:n})=>i.createElement(dt,j({},r,{ref:o,present:n})))}),dt=i.forwardRef((t,o)=>{const{__scopeCollapsible:a,present:r,children:c,...n}=t,f=W(ge,a),[m,b]=i.useState(r),u=i.useRef(null),h=he(o,u),v=i.useRef(0),R=v.current,S=i.useRef(0),T=S.current,P=f.open||m,O=i.useRef(P),A=i.useRef();return i.useEffect(()=>{const x=requestAnimationFrame(()=>O.current=!1);return()=>cancelAnimationFrame(x)},[]),ke(()=>{const x=u.current;if(x){A.current=A.current||{transitionDuration:x.style.transitionDuration,animationName:x.style.animationName},x.style.transitionDuration="0s",x.style.animationName="none";const $=x.getBoundingClientRect();v.current=$.height,S.current=$.width,O.current||(x.style.transitionDuration=A.current.transitionDuration,x.style.animationName=A.current.animationName),b(r)}},[f.open,r]),i.createElement(K.div,j({"data-state":X(f.open),"data-disabled":f.disabled?"":void 0,id:f.contentId,hidden:!P},n,{ref:h,style:{"--radix-collapsible-content-height":R?`${R}px`:void 0,"--radix-collapsible-content-width":T?`${T}px`:void 0,...t.style}}),P&&c)});function X(t){return t?"open":"closed"}const ft=nt,mt=ct,xt=it,M="Accordion",pt=["Home","End","ArrowDown","ArrowUp","ArrowLeft","ArrowRight"],[Z,ut,bt]=Te(M),[G,Yt]=pe(M,[bt,ve]),ee=ve(),je=d.forwardRef((t,o)=>{const{type:a,...r}=t,c=r,n=r;return d.createElement(Z.Provider,{scope:t.__scopeAccordion},a==="multiple"?d.createElement(gt,j({},n,{ref:o})):d.createElement(vt,j({},c,{ref:o})))});je.propTypes={type(t){const o=t.value||t.defaultValue;return t.type&&!["single","multiple"].includes(t.type)?new Error("Invalid prop `type` supplied to `Accordion`. Expected one of `single | multiple`."):t.type==="multiple"&&typeof o=="string"?new Error("Invalid prop `type` supplied to `Accordion`. Expected `single` when `defaultValue` or `value` is type `string`."):t.type==="single"&&Array.isArray(o)?new Error("Invalid prop `type` supplied to `Accordion`. Expected `multiple` when `defaultValue` or `value` is type `string[]`."):null}};const[Ce,ht]=G(M),[we,$t]=G(M,{collapsible:!1}),vt=d.forwardRef((t,o)=>{const{value:a,defaultValue:r,onValueChange:c=()=>{},collapsible:n=!1,...f}=t,[m,b]=Y({prop:a,defaultProp:r,onChange:c});return d.createElement(Ce,{scope:t.__scopeAccordion,value:m?[m]:[],onItemOpen:b,onItemClose:d.useCallback(()=>n&&b(""),[n,b])},d.createElement(we,{scope:t.__scopeAccordion,collapsible:n},d.createElement(Ne,j({},f,{ref:o}))))}),gt=d.forwardRef((t,o)=>{const{value:a,defaultValue:r,onValueChange:c=()=>{},...n}=t,[f=[],m]=Y({prop:a,defaultProp:r,onChange:c}),b=d.useCallback(h=>m((v=[])=>[...v,h]),[m]),u=d.useCallback(h=>m((v=[])=>v.filter(R=>R!==h)),[m]);return d.createElement(Ce,{scope:t.__scopeAccordion,value:f,onItemOpen:b,onItemClose:u},d.createElement(we,{scope:t.__scopeAccordion,collapsible:!0},d.createElement(Ne,j({},n,{ref:o}))))}),[jt,H]=G(M),Ne=d.forwardRef((t,o)=>{const{__scopeAccordion:a,disabled:r,dir:c,orientation:n="vertical",...f}=t,m=d.useRef(null),b=he(m,o),u=ut(a),v=Oe(c)==="ltr",R=be(t.onKeyDown,S=>{var T;if(!pt.includes(S.key))return;const P=S.target,O=u().filter(z=>{var B;return!((B=z.ref.current)!==null&&B!==void 0&&B.disabled)}),A=O.findIndex(z=>z.ref.current===P),x=O.length;if(A===-1)return;S.preventDefault();let $=A;const L=0,F=x-1,p=()=>{$=A+1,$>F&&($=L)},I=()=>{$=A-1,$<L&&($=F)};switch(S.key){case"Home":$=L;break;case"End":$=F;break;case"ArrowRight":n==="horizontal"&&(v?p():I());break;case"ArrowDown":n==="vertical"&&p();break;case"ArrowLeft":n==="horizontal"&&(v?I():p());break;case"ArrowUp":n==="vertical"&&I();break}const U=$%x;(T=O[U].ref.current)===null||T===void 0||T.focus()});return d.createElement(jt,{scope:a,disabled:r,direction:c,orientation:n},d.createElement(Z.Slot,{scope:a},d.createElement(K.div,j({},f,{"data-orientation":n,ref:b,onKeyDown:r?void 0:R}))))}),J="AccordionItem",[Ct,te]=G(J),wt=d.forwardRef((t,o)=>{const{__scopeAccordion:a,value:r,...c}=t,n=H(J,a),f=ht(J,a),m=ee(a),b=ue(),u=r&&f.value.includes(r)||!1,h=n.disabled||t.disabled;return d.createElement(Ct,{scope:a,open:u,disabled:h,triggerId:b},d.createElement(ft,j({"data-orientation":n.orientation,"data-state":ye(u)},m,c,{ref:o,disabled:h,open:u,onOpenChange:v=>{v?f.onItemOpen(r):f.onItemClose(r)}})))}),Nt="AccordionHeader",yt=d.forwardRef((t,o)=>{const{__scopeAccordion:a,...r}=t,c=H(M,a),n=te(Nt,a);return d.createElement(K.h3,j({"data-orientation":c.orientation,"data-state":ye(n.open),"data-disabled":n.disabled?"":void 0},r,{ref:o}))}),xe="AccordionTrigger",At=d.forwardRef((t,o)=>{const{__scopeAccordion:a,...r}=t,c=H(M,a),n=te(xe,a),f=$t(xe,a),m=ee(a);return d.createElement(Z.ItemSlot,{scope:a},d.createElement(mt,j({"aria-disabled":n.open&&!f.collapsible||void 0,"data-orientation":c.orientation,id:n.triggerId},m,r,{ref:o})))}),It="AccordionContent",_t=d.forwardRef((t,o)=>{const{__scopeAccordion:a,...r}=t,c=H(M,a),n=te(It,a),f=ee(a);return d.createElement(xt,j({role:"region","aria-labelledby":n.triggerId,"data-orientation":c.orientation},f,r,{ref:o,style:{"--radix-accordion-content-height":"var(--radix-collapsible-content-height)","--radix-accordion-content-width":"var(--radix-collapsible-content-width)",...t.style}}))});function ye(t){return t?"open":"closed"}const Et=je,St=wt,Pt=yt,Ae=At,Ie=_t,Rt=Et,_e=i.forwardRef(({className:t,...o},a)=>e.jsx(St,{ref:a,className:Q("border-b",t),...o}));_e.displayName="AccordionItem";const Ee=i.forwardRef(({className:t,children:o,...a},r)=>e.jsx(Pt,{className:"flex",children:e.jsxs(Ae,{ref:r,className:Q("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",t),...a,children:[o,e.jsx(Me,{className:"h-4 w-4 shrink-0 transition-transform duration-200"})]})}));Ee.displayName=Ae.displayName;const Se=i.forwardRef(({className:t,children:o,...a},r)=>e.jsx(Ie,{ref:r,className:"overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",...a,children:e.jsx("div",{className:Q("pb-4 pt-0",t),children:o})}));Se.displayName=Ie.displayName;const Dt="/app";function Qt(){const[t,o]=i.useState([]),[a,r]=i.useState(0),[c,n]=i.useState([]),[f,m]=i.useState(0),[b,u]=i.useState(""),[h,v]=i.useState({id:0,name:"",propertyId:0,deletedAt:""}),[R,S]=i.useState([]),[T,P]=i.useState(!1),[O,A]=i.useState(!1),[x,$]=i.useState(0),L=tt(),F=Ve(),p=de({resolver:me(Qe),values:{type:"",business_type:"",title:"",short_description:"",long_description:"",street:"",city:"",state:"",zip:"",is_active:!0,price:0}}),I=de({resolver:me(We),defaultValues:{file:void 0}});i.useEffect(()=>{Xe.findAllUI().then(s=>{o(s),r(Math.random())}),Ze.findAllUI().then(s=>{n(s),m(Math.random())})},[x,p]);function U(s){var se;const l=(se=c.find(D=>D.name===s.type))==null?void 0:se.color;let g;s.is_active===!0?g=1:g=0;const Re={...s,color:l||"",is_active:g};et.create(Re).then(D=>{D.id&&(_({title:"200",description:"Propiedad creada",variant:"success",duration:5e3}),A(!0),$(D.id)),D.statusCode>399&&_({title:D.statusCode,description:D.message,variant:"destructive",duration:5e3}),D instanceof Error&&_({title:"Error",description:"500 Internal Server Error | "+D.message,variant:"destructive",duration:5e3})})}function z(s){q.create(x,s.file[0]).then(l=>{l.statusCode===200&&(q.findByProperty(x).then(g=>{g.statusCode===200&&S(g),g.statusCode>399&&_({title:g.statusCode,description:g.message,variant:"destructive",duration:5e3}),g instanceof Error&&_({title:"Error",description:"500 Internal Server Error | "+g.message,variant:"destructive",duration:5e3})}),_({title:l.statusCode,description:l.message,variant:"success",duration:5e3}),I.reset(),u("")),l.statusCode>399&&_({title:l.statusCode,description:l.message,variant:"destructive",duration:5e3}),l instanceof Error&&_({title:"Error",description:"500 Internal Server Error | "+l.message,variant:"destructive",duration:5e3})})}function B(s){q.remove(s).then(l=>{l.statusCode===200&&(S(R.filter(g=>g.id!==s)),_({title:l.statusCode,description:l.message,variant:"success",duration:5e3})),l.statusCode>399&&_({title:l.statusCode,description:l.message,variant:"destructive",duration:5e3}),l instanceof Error&&_({title:"Error",description:"500 Internal Server Error | "+l.message,variant:"destructive",duration:5e3})}),P(!1)}function Pe(s){u(s.currentTarget.value.split("\\")[2])}return e.jsxs("main",{className:"flex-1 overflow-y-auto",children:[e.jsxs("div",{className:"flex flex-row items-center justify-between px-8 pt-8",children:[e.jsx("h1",{className:"text-2xl font-normal text-slate-600",children:"Crear Propiedad"}),e.jsxs(k,{variant:"ghost",size:"sm",onClick:()=>F(-1),children:[e.jsx(st,{className:"mr-2 h-4 w-4"}),"Volver"]})]}),e.jsxs("div",{className:"mt-6 flex flex-col items-center justify-center px-8",children:[e.jsx(ie,{className:"flex w-full flex-row py-8 md:w-[500px] lg:w-[650px]",children:e.jsxs(Fe,{className:"mx-0 w-full p-0",children:[e.jsx(fe,{...p,children:e.jsx("form",{onSubmit:p.handleSubmit(U),className:"space-y-8",children:e.jsxs("div",{className:"container mx-auto space-y-4",children:[e.jsxs("div",{className:"flex w-full flex-col font-semibold text-slate-800",children:["Descripción",e.jsx(ae,{className:"mt-2"})]}),e.jsxs("div",{className:"flex w-1/2 flex-col gap-4 py-4 md:w-2/3 md:flex-row md:gap-6",children:[e.jsx(C,{control:p.control,name:"business_type",render:({field:s})=>e.jsxs(w,{className:"w-full space-y-1",children:[e.jsx(E,{className:"font-semibold text-slate-500",children:"Tipo"}),e.jsxs(re,{onValueChange:l=>s.onChange(l),children:[e.jsx(N,{children:e.jsx(oe,{children:e.jsx(ne,{placeholder:""})})}),e.jsx(le,{children:t.map(l=>e.jsx(ce,{value:l.name,className:"text-sm",children:L(l.name)},l.id))})]},a),e.jsx(y,{})]})}),e.jsx(C,{control:p.control,name:"type",render:({field:s})=>e.jsxs(w,{className:"w-full space-y-1",children:[e.jsx(E,{className:"font-semibold text-slate-500",children:"Categoría"}),e.jsxs(re,{onValueChange:l=>s.onChange(l),children:[e.jsx(N,{children:e.jsx(oe,{children:e.jsx(ne,{placeholder:""})})}),e.jsx(le,{children:c.map(l=>e.jsx(ce,{value:l.name,className:"text-sm",children:L(l.name)},l.id))})]},f),e.jsx(y,{})]})})]}),e.jsxs("div",{className:"flex flex-col gap-4 md:flex-row md:gap-6",children:[e.jsx("div",{className:"flex flex-row md:w-1/2 md:flex-col",children:e.jsx(C,{control:p.control,name:"title",render:({field:s})=>e.jsxs(w,{className:"w-full space-y-1",children:[e.jsx(E,{className:"font-semibold text-slate-500",children:"Título"}),e.jsx(N,{children:e.jsx(V,{placeholder:"",...s})}),e.jsx(y,{})]})})}),e.jsx("div",{className:"flex flex-row md:w-1/2 md:flex-col",children:e.jsx(C,{control:p.control,name:"short_description",render:({field:s})=>e.jsxs(w,{className:"w-full space-y-1",children:[e.jsx(E,{className:"font-semibold text-slate-500",children:"Descripción breve"}),e.jsx(N,{children:e.jsx(V,{placeholder:"",...s})}),e.jsx(y,{})]})})})]}),e.jsx("div",{className:"mt-4 flex flex-col",children:e.jsx(C,{control:p.control,name:"long_description",render:({field:s})=>e.jsxs(w,{className:"w-full space-y-1",children:[e.jsx(E,{className:"font-semibold text-slate-500",children:"Descripción extendida"}),e.jsx(N,{children:e.jsx(Ye,{...s,className:"h-28"})}),e.jsx(y,{})]})})}),e.jsxs("div",{className:"flex w-full flex-col pt-4 font-semibold text-slate-800",children:["Dirección",e.jsx(ae,{className:"mt-2"})]}),e.jsxs("div",{className:"flex flex-row gap-6 md:flex-row md:gap-6",children:[e.jsx("div",{className:"flex w-2/3 flex-row md:w-2/3 md:flex-col",children:e.jsx(C,{control:p.control,name:"street",render:({field:s})=>e.jsxs(w,{className:"w-full space-y-1",children:[e.jsx(E,{className:"font-semibold text-slate-500",children:"Calle"}),e.jsx(N,{children:e.jsx(V,{placeholder:"",...s})}),e.jsx(y,{})]})})}),e.jsx("div",{className:"flex w-auto flex-row md:w-1/3 md:flex-col",children:e.jsx(C,{control:p.control,name:"city",render:({field:s})=>e.jsxs(w,{className:"w-full space-y-1",children:[e.jsx(E,{className:"font-semibold text-slate-500",children:"Ciudad"}),e.jsx(N,{children:e.jsx(V,{placeholder:"",...s})}),e.jsx(y,{})]})})})]}),e.jsxs("div",{className:"flex flex-row gap-6 md:flex-row md:gap-6",children:[e.jsx("div",{className:"flex w-2/3 flex-row md:w-2/3 md:flex-col",children:e.jsx(C,{control:p.control,name:"state",render:({field:s})=>e.jsxs(w,{className:"w-full space-y-1",children:[e.jsx(E,{className:"font-semibold text-slate-500",children:"Provincia"}),e.jsx(N,{children:e.jsx(V,{placeholder:"",...s})}),e.jsx(y,{})]})})}),e.jsx("div",{className:"flex w-auto flex-row md:w-1/3 md:flex-col",children:e.jsx(C,{control:p.control,name:"zip",render:({field:s})=>e.jsxs(w,{className:"w-full space-y-1",children:[e.jsx(E,{className:"font-semibold text-slate-500",children:"Código Postal"}),e.jsx(N,{children:e.jsx(V,{type:"text",...s})}),e.jsx(y,{})]})})})]}),e.jsxs("div",{className:"flex flex-row place-items-center gap-6 md:flex-row md:gap-6",children:[e.jsx("div",{className:"flex w-2/3 flex-row md:w-1/3 md:flex-col",children:e.jsx(C,{control:p.control,name:"price",render:({field:s})=>e.jsxs(w,{className:"w-full space-y-1",children:[e.jsx(E,{className:"font-semibold text-slate-500",children:"Precio"}),e.jsx(N,{children:e.jsx(V,{type:"text",inputMode:"numeric",...s})}),e.jsx(y,{})]})})}),e.jsx("div",{className:"mt-8 flex w-2/3 flex-row md:w-2/3 md:flex-col",children:e.jsx(C,{control:p.control,name:"is_active",render:({field:s})=>e.jsxs(w,{className:"flex w-full justify-end",children:[e.jsx(N,{children:e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(qe,{id:"is_active",onCheckedChange:s.onChange,className:"data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-input"}),e.jsx(Ue,{htmlFor:"is_active",children:"Activo"})]})}),e.jsx(y,{})]})})})]}),e.jsxs("div",{className:"flex flex-row justify-end space-x-4 pt-6",children:[e.jsx(k,{variant:"ghost",onClick:s=>{s.preventDefault(),I.reset(),F(-1)},children:"Cancelar"}),e.jsx(k,{type:"submit",variant:"default",children:"Guardar"})]})]})})}),O&&e.jsx("div",{className:"px-8",children:e.jsx(Rt,{type:"single",collapsible:!0,children:e.jsxs(_e,{value:"item-1",className:"border-none",children:[e.jsx(Ee,{className:"justify-start pb-0 pt-4",children:"Agregar imágenes"}),e.jsxs(Se,{className:"py-0",children:[e.jsxs("div",{className:"grid gap-4 pt-6",children:[R.map((s,l)=>e.jsx(ie,{className:"bg-slate-100/50 px-1 py-1",children:e.jsxs("div",{className:"flex flex-row place-items-center justify-between",children:[e.jsxs("div",{className:"flex h-5 flex-row",children:[e.jsx("img",{src:Je(s.name)}),e.jsxs("h2",{className:"flex flex-row place-items-center pl-3 text-xs font-medium text-slate-900",children:["# ",l+1]})]}),e.jsx("div",{className:"hidden flex-row text-xs font-light text-slate-400 xs:block md:block lg:block",children:s.name}),e.jsx(k,{onClick:()=>{P(!0),v({id:s.id,name:s.name,propertyId:s.propertyId,deletedAt:s.deletedAt})},variant:"ghost",size:"miniIcon",className:"rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-rose-500",children:e.jsx(at,{className:"h-4 w-4"})})]})},s.id)),e.jsx(Le,{open:T,onOpenChange:P,children:e.jsxs(ze,{children:[e.jsxs(Be,{children:[e.jsx(Ke,{children:"¿Estás realmente seguro?"}),e.jsx(Ge,{children:"Esta acción es imposible de revertir."})]}),e.jsxs("div",{children:[e.jsxs("section",{className:"text-sm font-normal",children:["La imágen",e.jsx("span",{className:"text-md px-1 font-bold text-slate-900",children:h.name}),"de la propiedad se eliminará permanentemente de la base de datos."]}),e.jsx(He,{children:e.jsxs("div",{className:"mt-6 flex flex-row gap-4",children:[e.jsx(k,{variant:"ghost",onClick:()=>P(!1),children:"Cancelar"}),e.jsx(k,{variant:"delete",onClick:()=>B(h.id),children:"Eliminar"})]})})]})]})})]}),e.jsx(fe,{...I,children:e.jsx("form",{onSubmit:I.handleSubmit(z),children:e.jsx("div",{className:"mt-6 grid w-full grid-cols-1 items-center gap-1.5",children:e.jsx(C,{control:I.control,name:"file",render:()=>e.jsxs(w,{className:"grid grid-cols-1 items-center justify-between space-y-4 md:grid-cols-3 md:space-y-0",children:[e.jsxs("div",{className:"flex flex-row items-center gap-2 md:col-span-2",children:[e.jsx(E,{className:"h-fit rounded-md border bg-slate-100/70 p-2 font-semibold text-slate-500 hover:cursor-pointer hover:bg-slate-100",children:"Seleccionar imágen"}),e.jsx("span",{className:"text-md flex flex-row font-light text-slate-600",children:b}),e.jsx(N,{children:e.jsx(V,{...I.register("file"),name:"file",type:"file",accept:"image/*",className:"m-0 h-0 w-0 p-0 opacity-0 hover:cursor-pointer",onChange:s=>Pe(s)})})]}),e.jsxs("div",{className:"flex flex-row place-content-end gap-4 md:col-span-1",children:[e.jsx(k,{variant:"outline",size:"sm",onClick:s=>{s.preventDefault(),I.reset(),u("")},className:"w-auto px-2 text-xs",children:"Cancelar"}),e.jsx(k,{variant:"default",size:"sm",className:"w-auto border-slate-400 bg-slate-400 px-2 text-xs hover:border-slate-500 hover:bg-slate-500",type:"submit",children:"Guardar"})]}),e.jsx(y,{})]})})})})})]})]})})})]})}),e.jsx("section",{className:"py-6",children:e.jsx(k,{onClick:()=>F(`${Dt}/productos/${x}`),variant:"secondary",size:"sm",className:"w-auto border bg-slate-200 hover:bg-slate-200/70",children:"Ver la propiedad que creaste"})})]})]})}export{Qt as default};