"use client";
import Image from "next/image";
import Link from "next/link";
import { useCurrentUser } from "../../hooks/use-currentUser";
import { useState } from "react";
const Menu = () => {
 const user = useCurrentUser();
const role = user?.role?.toLowerCase(); 
 const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Register",
        href: "/list/register",
        visible: ["admin"],
      },
      {
        icon: "/home.png",
        label: "Home",
        href: `/${role}`,
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/home.png",
        label: "Dashboard",
        href: `/list/AttendanceStat`,
        visible: ["admin", "teacher"],
      },
       {
        icon: "/home.png",
        label: "resultDashboard",
        href: `/list/resultDashboard`,
        visible: ["admin", "teacher"],
      },
       {
        icon: "/home.png",
        label: "addResult",
        href: `/list/addResults`,
        visible: ["admin", "teacher"],
      }, 
      {
        icon: "/home.png",
        label: "ViewResult",
        href: `/list/viewResults`,
        visible: ["admin", "teacher"],
      },
      {
        icon: "/home.png",
        label: "studentResult",
        href: `/list/singleStudentResult`,
        visible: ["admin", "teacher"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/event",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
   {
      title: "OTHER",
      items: [
        {
          icon: "/profile.png",
          label: "help",
          href: "/list/AdminPasswordChange",
          visible: ["admin"],
        },
        {
          icon: "/setting.png",
          label: "Settings",
          href: "#",
          visible: ["admin", "teacher", "student", "parent"],
          isDropdown: true,
          dropdownItems: [
            {
              label: "Change Password",
              href: "/list/changePassword",
            },
            
            {
              label: "Preferences",
              href: "/settings/preferences",
            },
          ],
        },
        {
          icon: "/logout.png",
          label: "Logout",
          href: "/logout",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
];


 // Ensure role is in lowercase

  return (
    <div className="mt-4 text-sm overflow-y-scroll pb-40">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items
            .filter((item) =>
              item.visible.some((r) => r.toLowerCase() === role)
            )
            .map((item) => (
              <div key={item.label} className="relative">
                {!item.isDropdown ? (
                  <Link
                    href={item.href}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                  >
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setShowSettingsDropdown(!showSettingsDropdown)
                      }
                      className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight w-full"
                    >
                      <Image src={item.icon} alt="" width={20} height={20} />
                      <span className="hidden lg:block">{item.label}</span>
                    </button>
                    {showSettingsDropdown && (
                      <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md text-sm z-10">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            href={dropdownItem.href}
                            key={dropdownItem.label}
                            className="block px-4 py-2 text-gray-500 hover:bg-gray-100"
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;