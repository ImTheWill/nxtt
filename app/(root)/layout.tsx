import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

//we fetch here
//prop drilling is occurring here might be beneficial to use something else
const Layout = async ({children}:{children:React.ReactNode}) => {
    const currentUser = await getCurrentUser(); //gets user session info
    if(!currentUser) return redirect("/sign-in");//if user doesnt exist
    return ( 
        <main className="flex h-screen">
              <Sidebar {...currentUser}/>
            <section className="flex h-full flex-1 flex-col">
                    <MobileNavigation {...currentUser}/>
                    <Header {...currentUser} ownerId={currentUser.$id}/>
                <div className="main-content">
                    {children}
                </div>
                <Toaster/>
            </section>
        </main>
     );
}
 
export default Layout;