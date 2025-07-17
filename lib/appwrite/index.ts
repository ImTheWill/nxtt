"use server";

import { cookies } from "next/headers";
import { appwriteConfig } from "./config"
import {Account, Avatars, Client, Databases, Storage} from "node-appwrite";
//node appwrite

//can create admin client or session client,
//session client is linked specifically to a user session letting users access their data or perform actions they are allowed to
export const createSessionClient = async () =>{
    const client = new Client().setEndpoint(appwriteConfig.endpointUrl).setProject(appwriteConfig.projectID);

    const session =  (await cookies()).get('appwrite-session');
    if(!session || !session.value){
        throw new Error('no sesssion')
    }
    client.setSession(session.value)
    return {
        get account(){
            return new Account(client);
        },
        get databases(){
            return new Databases(client);
        }
    }
}


//admin client used to create new users, manage databases or handle high level access never exposed to use directly
export const createAdminClient = async ()=>{
    const client = new Client().setEndpoint(appwriteConfig.endpointUrl).setProject(appwriteConfig.projectID).setKey(appwriteConfig.secretKey);


    return {
        get account(){
            return new Account(client);
        },
        get databases(){
            return new Databases(client);
        },
        get storage(){
            return new Storage(client);

        },
        get Avatar(){
            return new Avatars(client)
        }
    }
}