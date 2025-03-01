import { PrismaClient, PeriodType, Day } from '@prisma/client';
const prisma = new PrismaClient();

// Define the maximum number of classes a teacher can handle per week
const TEACHER_WORKLOAD_LIMIT = 30;

async function generateSchedule() {
  try {
    // Step 1: Gather Necessary Data
    const teacherAssignments = await prisma.teacherAssignment.findMany({
      include: {
        teacher: true,
        gradeClass: true,
        subject: true,
      },
    });

    const subjectQuotas = await prisma.subjectQuota.findMany();
    const periodTimetable = await prisma.periodTimetable.findMany({
      where: {
        type: PeriodType.CLASS, // Only consider class periods, not breaks
      },
      orderBy: {
        rollNo: 'asc', // Ensure periods are ordered by roll number
      },
    });

    const daysOfWeek: Day[] = [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY];

    // Step 2: Create a map to track teacher and class schedules
    const teacherScheduleMap: Record<string, Set<string>> = {};
    const classScheduleMap: Record<string, Set<string>> = {};

    // Step 3: Assign subjects to classes and teachers
    for (const assignment of teacherAssignments) {
      const { teacher, gradeClass, subject } = assignment;
      const quota = subjectQuotas.find(
        (sq) => sq.subjectId === subject.id && sq.gradeClassId === gradeClass.id
      );

      if (!quota) {
        console.warn(`No quota found for subject ${subject.name} in class ${gradeClass.id}`);
        continue;
      }

      const weeklyPeriods = quota.weeklyPeriods;
      const periodsPerDay = Math.ceil(weeklyPeriods / daysOfWeek.length);

      for (const day of daysOfWeek) {
        for (let i = 0; i < periodsPerDay; i++) {
          const period = periodTimetable[i % periodTimetable.length];

          // Step 4: Check teacher workload
          const teacherWorkload = await prisma.schedule.count({
            where: {
              teacherId: teacher.id,
              day,
            },
          });

          if (teacherWorkload >= TEACHER_WORKLOAD_LIMIT) {
            console.warn(`Teacher ${teacher.name} has reached the workload limit on ${day}`);
            continue;
          }

          // Step 5: Check for conflicts
          const teacherKey = `${teacher.id}-${day}-${period.startTime}-${period.endTime}`;
          const classKey = `${gradeClass.id}-${day}-${period.startTime}-${period.endTime}`;

          if (teacherScheduleMap[teacherKey] || classScheduleMap[classKey]) {
            console.warn(`Conflict detected for teacher ${teacher.name} or class ${gradeClass.id} on ${day}`);
            continue;
          }

          // Step 6: Assign the schedule
          await prisma.schedule.create({
            data: {
              teacherId: teacher.id,
              gradeClassId: gradeClass.id,
              subjectId: subject.id,
              day,
              startTime: period.startTime,
              endTime: period.endTime,
              year: "2024/25",
            },
          });

          // Update the maps to track assigned schedules
          teacherScheduleMap[teacherKey] = new Set([subject.id]);
          classScheduleMap[classKey] = new Set([subject.id]);

          console.log(`Scheduled ${subject.name} for ${gradeClass.id} on ${day} at ${period.startTime}`);
        }
      }
    }
  } catch (error) {
    console.error('Error generating schedule:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateSchedule();