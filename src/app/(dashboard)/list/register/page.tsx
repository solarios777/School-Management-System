import Image from "next/image";
import Link from "next/link";

interface NavigationItem {
  icon: string;
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  {
    icon: "/student.png",
    label: "Student",
    href: "/list/register/student",
  },
  {
    icon: "/teacher.png",
    label: "Teacher",
    href: "/list/register/teacher",
  },
  {
    icon: "/teacher.png",
    label: "Staff",
    href: "/list/register/staff",
  },
  {
    icon: "/parent.png",
    label: "Parent",
    href: "/list/register/parent",
  },
];

const NavigationPanel: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="hidden md:block text-lg font-semibold">
        which one do you wanna register
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {navigationItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <div className="flex flex-col items-center justify-center p-4 bg-lamaYellow rounded-md hover:bg-lamaPurpleLight transition-colors duration-300">
              <Image src={item.icon} alt={item.label} width={32} height={32} />
              <span className="text-sm font-medium mt-2">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavigationPanel;
