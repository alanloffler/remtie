import{U as s}from"./users.config-Dva0wEUX.js";import{z as e}from"./zod-D9tdBR2H.js";const m=e.object({name:e.string().min(3,{message:s.schemas.createUser.nameMessage}),email:e.string().email({message:s.schemas.createUser.emailFormat}),password:e.string().min(6,{message:s.schemas.createUser.emailMessage}),phone:e.string().optional(),role:e.string().min(1,{message:s.schemas.createUser.roleMessage})}),t=e.object({name:e.string().min(3,{message:s.schemas.createUser.nameMessage}),email:e.string().email({message:s.schemas.createUser.emailFormat}),password:e.string().optional(),phone:e.string().optional(),role:e.string().min(1,{message:s.schemas.createUser.roleMessage})});export{t as a,m as u};
