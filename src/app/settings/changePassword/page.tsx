
import FormContainer from "@/components/FormContainer"
import { Button } from "@/components/ui/button"
import { currentUser } from "@/lib/auth"
import Link from "next/link"


const page = async() => {
  const user=await currentUser()
  const username=user?.name
  const role= user?.role.toLocaleLowerCase()
  return (
    <div className="flex justify-center items-center flex-col gap-y-4 p-8">
      <Button className="rounded-md mb-4"> <Link href={`/${role}`}>Back to home</Link></Button>
     
      <FormContainer table="changePassword" type="changePassword" role={role} username={username}/>
    </div>
  )
}

export default page
