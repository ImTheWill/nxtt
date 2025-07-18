import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
//we fetch here

const Layout = async ({children}:{children:React.ReactNode}) => {
    const currentUser = await getCurrentUser(); //gets user session info
    if(!currentUser) return redirect("/sign-in");//if user doesnt exist

    return ( 
        <main className="flex h-screen">
              <Sidebar {...currentUser}/>
            <section className="flex h-full flex-1 flex-col">
                    <MobileNavigation {...currentUser}/>
                    <Header/>
                <div className="main-content">
                    {children}
                </div>
            </section>
        </main>
     );
}
 
export default Layout;