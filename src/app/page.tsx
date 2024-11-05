import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";

const font= Poppins({
    subsets:["latin"],
    weight:["600"]

})

const page = () => {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-sky-500">
        <div className="space-y-6 text-center">
            <h1 className={cn("text-6xl font-semibold text-white uppercase drop-shadow-md",font.className)}>
                MCS
            </h1>
            <p className="text-white text-2xl">
                where you build your future
            </p>
            <LoginButton>
               <Button variant={"secondary"} size={ "lg"} >sign in</Button>
           </LoginButton>
        </div>
    </main>
  );
}

export default page;