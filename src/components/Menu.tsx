"use client";
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
          label: "Register",
          href: "/list/register",
          visible: ["admin"],
        },
        {
          label: "Home",
          href: `/${role}`,
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          label: "Dashboard",
          href: `/list/AttendanceStat`,
          visible: ["admin", "teacher"],
        },
        {
          label: "Result Dashboard",
          href: `/list/resultDashboard`,
          visible: ["admin", "teacher"],
        },
        {
          label: "Add Result",
          href: `/list/addResults`,
          visible: ["admin", "teacher"],
        },
        {
          label: "View Result",
          href: `/list/viewResults`,
          visible: ["admin", "teacher"],
        },
        {
          label: "Student Result",
          href: `/list/singleStudentResult`,
          visible: ["admin", "teacher"],
        },
        {
          label: "Schedule",
          href: `/list/schedule`,
          visible: ["admin", "teacher"],
        },
        {
          label: "Tasks",
          href: `/list/tasks`,
          visible: ["admin", "teacher"],
        },
        {
          label: "Teachers",
          href: "/list/teachers",
          visible: ["admin", "teacher"],
        },
        {
          label: "Students",
          href: "/list/students",
          visible: ["admin", "teacher"],
        },
        {
          label: "Parents",
          href: "/list/parents",
          visible: ["admin", "teacher"],
        },
        {
          label: "Subjects",
          href: "/list/subjects",
          visible: ["admin"],
        },
        {
          label: "Classes",
          href: "/list/classes",
          visible: ["admin", "teacher"],
        },
        {
          label: "Attendance",
          href: "/list/attendance",
          visible: ["admin", "teacher"],
        },
        {
          label: "Lessons",
          href: "/list/lessons",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          label: "Exams",
          href: "/list/exams",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          label: "Assignments",
          href: "/list/assignments",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          label: "Results",
          href: "/list/results",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          label: "Events",
          href: "/list/event",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          label: "Messages",
          href: "/list/messages",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
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
          label: "Help",
          href: "/list/AdminPasswordChange",
          visible: ["admin"],
        },
        {
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
          label: "Logout",
          href: "/logout",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
  ];

  return (
    <div className="mt-4 text-sm overflow-y-scroll pb-40">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items
            .filter((item) => item.visible.some((r) => r.toLowerCase() === role))
            .map((item) => (
              <div key={item.label} className="relative">
                {!item.isDropdown ? (
                  <Link
                    href={item.href}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-blue-200"
                  >
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setShowSettingsDropdown(!showSettingsDropdown)
                      }
                      className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-blue-200 w-full"
                    >
                      <span>{item.label}</span>
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