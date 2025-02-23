// import Announcements from "@/components/Announcements";
// import BigCalendarContainer from "@/components/BigCalendarContainer";
// import { useCurrentUser } from "../../../../hooks/use-currentUser";
// import { currentUser } from "@/lib/auth";


// const TeacherPage = async() => {
//   const user = await currentUser();
//   const role = user?.role;
//   const currentUserId=user?.id
//   const userId = currentUserId;
//   return (
//     <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
//       {/* LEFT */}
//       <div className="w-full xl:w-2/3">
//         <div className="h-full bg-white p-4 rounded-md">
//           <h1 className="text-xl font-semibold">Schedule</h1>
//           {/* <BigCalendarContainer type="teacherId" id={userId!} /> */}
//         </div>
//       </div>
//       {/* RIGHT */}
//       <div className="w-full xl:w-1/3 flex flex-col gap-8">
//         {/* <Announcements /> */}
//       </div>
//     </div>
//   );
// };

// export default TeacherPage;
"use client";
import { useEffect, useState } from "react";
import { fetchResultRelease } from "@/app/_services/GlobalApi"; // Adjust the import path

const ResultReleaseComponent = () => {
  const [data, setData] = useState<{ today: string; deadline: string } | null>(null);

  useEffect(() => {
    const getResultRelease = async () => {
      try {
        const result = await fetchResultRelease();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch result release data");
      }
    };
    getResultRelease();
  }, []);

  return (
    <div>
      <h2>Result Release Information</h2>
      {data ? (
        <p>
          <strong>Today Date:</strong> {data.today} <br />
          <strong>Deadline:</strong> {data.deadline}
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ResultReleaseComponent;
