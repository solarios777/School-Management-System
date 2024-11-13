import type { NextAuthConfig } from "next-auth"
import Credentials  from "next-auth/providers/credentials"

import { LoginSchema } from "./schema"
import {  getUserByUsername } from "./data/getUser"
import bcrypt from "bcryptjs"
import { getUserByUsernameForRole } from "./data/user"
 
export default { providers: [
    Credentials({

        
        async authorize(credentials) {
            const valdatedfields = LoginSchema.parse(credentials)
            if(!valdatedfields){    
                return null
            }
            if(valdatedfields){
                const {name,password, role} = valdatedfields

                const user = await getUserByUsernameForRole(name, role);
                if(!user || !user.password )
                    return null
                    
                const isPasswordCorrect = await bcrypt.compare(password, user.password)

                if(!isPasswordCorrect)
                    return null
                return user
            }

            return null
            
        }
    })
]
 } satisfies NextAuthConfig




 

// thawlek
