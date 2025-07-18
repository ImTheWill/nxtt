"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID } from "node-appwrite";
import { constructFileUrl, getFileType } from "../utils";
import { fi } from "zod/v4/locales";
import { revalidatePath } from "next/cache";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
export const uploadFile = async ({file, ownerId, accountId, path}:UploadFileProps) => {
    const {storage,databases} = await createAdminClient();
    try{
        const inputFile = InputFile.fromBuffer(file, file.name);
        //uploading file to appwrite storage
        const bucketFile = await storage.createFile(appwriteConfig.bucketId, ID.unique(), inputFile);


        //uploading file metadata to appwrite database
        //doing this so we can access metadata about the file later to then use later
        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            owner: ownerId,
            accountId: accountId,
            users:[],
            bucketFileId: bucketFile.$id,

        const newFile = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            ID.unique(),
            fileDocument,
        ).catch( async(error:unknown) => {
            // if there is an error, delete the file from storage
            await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
            handleError(error, "Failed to upload file metadata");
        });
        revalidatePath(path)
        return newFile;

    }catch (error) {
        handleError(error, "Failed to upload file");
    }

}