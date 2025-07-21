"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";


const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
export const uploadFile = async ({file, ownerId, accountId, path}:UploadFileProps) => {
    const {storage,databases} = await createAdminClient();
    try{
        const inputFile = InputFile.fromBuffer(file, file.name);// Create an InputFile from the buffer using node-appwrite/file

        const bucketFile = await storage.createFile(appwriteConfig.bucketId, ID.unique(), inputFile);//uploading file to appwrite storage


        //doing this so we can access metadata about the file later to then use later
        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId: accountId,
            users:[],
            bucketFileId: bucketFile.$id,
        };

        //uploading file metadata to appwrite database  
        const newFile = await databases
            .createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.filesCollectionId,
                ID.unique(),
                fileDocument,
            )
            .catch(async (error: unknown) => {
                await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id); // If the document creation fails, delete the uploaded file
                handleError(error, "Failed to create file document");
            });

        revalidatePath(path);
        return parseStringify(newFile);

    }catch (error) {
        handleError(error, "Failed to upload file");
    }

}
//models.document comes from node-appwrite
const createQueries = (user: Models.Document) => {
    const queries = [
        Query.or([
        Query.equal("owner", [user.$id]),
        Query.contains("users", [user.email]),
        ]),
    ];
    //add more queries based on user type or other conditions
    return queries;
}
export const getFiles = async () => {
    const {databases} = await createAdminClient();
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("User not Found");

        const queries = createQueries(user);
        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries
        );
        return parseStringify(files);
    } catch (error) {
        handleError(error, "Failed to fetch files");
    }
};

export const renameFile = async ({fileId, name, extension,path}:RenameFileProps) => {
    const {databases} = await createAdminClient();

    try{
        const newName = `${name}.${extension}`;
        console.log("Renaming file to:", newName);
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                name: newName
            }
        );
        revalidatePath(path);
        return parseStringify(updatedFile);

    }catch (error) {
        handleError(error, "Failed to rename file");
    }
}