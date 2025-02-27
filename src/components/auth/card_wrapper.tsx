"use client"

import { 
    Card ,
    CardContent,
    CardFooter,
    CardHeader
} from "../ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";

interface CardWrapperProps{
    children:React.ReactNode;
    headerLebel:string;
    backButtonLabel:string;
    backButtonHref:string;
    
}

export const CardWrapper = ({children,headerLebel,backButtonLabel,backButtonHref}:CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md bg-transparent backdrop-blur-sm">
        <CardHeader>
            <Header label={headerLebel}/>
        </CardHeader>
        <CardContent>
        {children}
        </CardContent>
        <CardFooter>
            <BackButton
            label={backButtonLabel}
            href={backButtonHref}
            
            />
        </CardFooter>
        </Card>
  )}
    