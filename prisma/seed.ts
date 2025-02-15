import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Create Parents
  const parents = await Promise.all(
    Array.from({ length: 50 }, (_, i) =>
      prisma.parent.create({
        data: {
          id: uuid(),
          username: `parent_user_${i + 1}`,
          name: `Parent Name ${i + 1}`,
          surname: `Surname ${i + 1}`,
          email: `parent${i + 1}@example.com`,
          sex: i % 2 === 0 ? 'MALE' : 'FEMALE',
          bloodType: 'O+',
          phone: `12345678${i}`,
          address: `Address ${i + 1}`,
          password: 'securepassword',
          birthday: new Date(1980 - i, 0, 1),
        },
      })
    )
  );

  // Create Students
  const students = await Promise.all(
    Array.from({ length: 50 }, (_, i) =>
      prisma.student.create({
        data: {
          username: `student_user_${i + 1}`,
          name: `Student Name ${i + 1}`,
          surname: `Surname ${i + 1}`,
          email: `student${i + 1}@example.com`,
          phone: `98765432${i}`,
          address: `Address ${i + 1}`,
          bloodType: 'O+',
          sex: i % 2 === 0 ? 'MALE' : 'FEMALE',
          password: 'securepassword',
          birthday: new Date(2010 - (i % 6), 0, 1),
          parentId: parents[i].id,
        },
      })
    )
  );

  // Create a temporary array to track enrollment
  const studentList = students.map((s) => ({ ...s, enrolled: false }));

  // Create Teachers
  const teachers = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.teacher.create({
        data: {
          username: `teacher_user_${i + 1}`,
          name: `Teacher Name ${i + 1}`,
          surname: `Surname ${i + 1}`,
          email: `teacher${i + 1}@example.com`,
          phone: `11122233${i}`,
          address: `Address ${i + 1}`,
          bloodType: 'A+',
          sex: i % 2 === 0 ? 'MALE' : 'FEMALE',
          password: 'securepassword',
          birthday: new Date(1980 - i, 0, 1),
        },
      })
    )
  );

  // Create Subjects
  const subjects = await Promise.all(
    [
      'Mathematics',
      'Science',
      'History',
      'Chemistry',
      'Biology',
      'English',
      'Physics',
      'Geography',
      'Literature',
    ].map((name) => prisma.subject.create({ data: { name } }))
  );

  // Create Grades (1, 2, 3, 4)
  const grades = await Promise.all(
    [1, 2, 3, 4].map((level) =>
      prisma.grade.create({
        data: { level },
      })
    )
  );

  // Create Sections (A, B)
  const sections = await Promise.all(
    ['A', 'B'].map((name) =>
      prisma.class.create({
        data: { name },
      })
    )
  );

  // Create Grade-Class Combinations
  const gradeClasses = await Promise.all(
    grades.flatMap((grade) =>
      sections.map((section) =>
        prisma.gradeClass.create({
          data: {
            gradeId: grade.id,
            classId: section.id,
          },
        })
      )
    )
  );

  // Enroll Students in each Grade-Class
  let studentIndex = 0;
  await Promise.all(
    gradeClasses.flatMap((gradeClass) => {
      const enrollments = [];

      // Ensure at least 3 males and 3 females
      for (let i = 0; i < 6; i++) {
        const gender = i < 3 ? 'MALE' : 'FEMALE';
        const student = studentList.find(
          (s) => s.sex === gender && !s.enrolled
        );
        if (student) {
          enrollments.push(
            prisma.enrollment.create({
              data: {
                studentId: student.id,
                gradeClassId: gradeClass.id,
                year: 2023,
              },
            })
          );
          student.enrolled = true;
        }
      }

      // Add 2 more students (any gender) to ensure at least 5 per class
      while (enrollments.length < 5) {
        const student = studentList[studentIndex];
        enrollments.push(
          prisma.enrollment.create({
            data: {
              studentId: student.id,
              gradeClassId: gradeClass.id,
              year: 2023,
            },
          })
        );
        student.enrolled = true;
        studentIndex++;
      }

      return enrollments;
    })
  );

  // Assign Teachers to each Grade-Class-Subject Combination
  await Promise.all(
    gradeClasses.flatMap((gradeClass) => {
      return subjects.map((subject, index) => {
        const teacher = teachers[index % teachers.length];
        return prisma.teacherAssignment.create({
          data: {
            teacherId: teacher.id,
            gradeClassId: gradeClass.id,
            subjectId: subject.id,
            year: 2023,
          },
        });
      });
    })
  );

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
