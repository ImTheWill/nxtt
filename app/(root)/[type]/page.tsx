import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import Card from "@/components/Card";
import { Models } from "node-appwrite";
import { getFileTypesParams } from "@/lib/utils";



//dynamic page to handle search parameters in Next.js
const Page = async ({searchParams,params}: SearchParamProps) => {
    const type = ((await params)?.type as string) || ""; // Extracting the type from the URL parameters
    const searchText = ((await searchParams)?.type as string) || ""; // Extracting the search text from the URL parameters
    const sort = ((await searchParams)?.sort as string) || "";


    const types = getFileTypesParams(type) as FileType[]

    const files = await getFiles({types, searchText, sort}); // Fetching files based on the type


    return ( 
        <div className="page-container">
            <section className="w-full ">
                <h1 className="h1 capitalize">{type}</h1>
                <div className="total-size-section">
                    <p className="body-1">
                        Total: <span className="h5"> 0 MB</span>
                    </p>
                    <div className="sort-containers">
                        <p className="body-1 hidden sm:block text-light-200">
                            Sort by:
                        </p>
                        <Sort/>
                    </div>
                </div>
            </section>
            {/* Render the files */}
            {files.total > 0 ? (
                <section className="file-list">
                {files.documents.map((file: Models.Document) => (
                    <Card key={file.$id} file={file} />
                ))}
                </section>
            ) : (
                <p className="empty-list">No files uploaded</p>
            )}
            
        </div>
     );
}
 
export default Page;