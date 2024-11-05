import { FaCheckCircle } from 'react-icons/fa';

interface FormsuccessProps {
    message: string;
}

export const Formsuccess = ({ message }: FormsuccessProps) => {

    if (!message) { return null; }

    return (
        <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-2 text-sm text-emerald-500">
            <FaCheckCircle className='h-5 w-5'/>
            <p>{message}</p>
        </div>
    )
}