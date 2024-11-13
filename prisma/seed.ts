import { PrismaClient } from '@prisma/client';
import { uuid } from 'uuidv4';

const prisma = new PrismaClient();

async function main() {
  // Create Admins
  const admins = await Promise.all(
    Array.from({ length: 10 }, (_, i) => 
      prisma.admin.create({
        data: {
          username: `admin_user_${i + 1}`,
          password: 'securepassword',
        },
      })
    )
  );

  // Create Parents
  const parents = await Promise.all(
    Array.from({ length: 10 }, (_, i) => 
      prisma.parent.create({
        data: {
          id: uuid(),
          username: `parent_user_${i + 1}`,
          name: `Parent Name ${i + 1}`,
          surname: `Surname ${i + 1}`,
          email: `parent${i + 1}@example.com`,
          phone: `12345678${i}`,
          address: `Address ${i + 1}`,
          password: 'securepassword',
        },
      })
    )
  );

  // Create Students
  const students = await Promise.all(
    Array.from({ length: 10 }, (_, i) => 
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
          birthday: new Date(2005 - i, 0, 1), // Different birthdays
          parentId: parents[i].id,
        },
      })
    )
  );

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
          birthday: new Date(1980 - i, 0, 1), // Different birthdays
        },
      })
    )
  );

  // Create Subjects
  const subjects = await Promise.all(
    ['Mathematics', 'Science', 'History', 'Geography', 'Literature'].map(name => 
      prisma.subject.create({ data: { name } })
    )
  );

  // Create Grades
  const grades = await Promise.all(
    Array.from({ length: 12 }, (_, i) => 
      prisma.grade.create({
        data: {
          level: i + 1,
        },
      })
    )
  );

  // Create Classes
  const classes = await Promise.all(
    ['A', 'B', 'C', 'D', 'E'].map(name => 
      prisma.class.create({
        data: {
          name: name,
          capacity: 30,
        },
      })
    )
  );

  // Create Enrollments
  await Promise.all(
    students.map((student, index) => {
      const gradeIndex = index % 12; // Assign grades in a loop
      const classIndex = index % classes.length; // Assign classes in a loop
      return prisma.enrollment.create({
        data: {
          studentId: student.id,
          gradeId: grades[gradeIndex].id,
          classId: classes[classIndex].id,
          year: 2023,
        },
      });
    })
  );

  // Create Teacher Assignments
  await Promise.all(
    teachers.map((teacher, index) => {
      const gradeIndex = index % 12; // Assign grades in a loop
      const classIndex = index % classes.length; // Assign classes in a loop
      const subjectIndex = index % subjects.length; // Assign subjects in a loop
      return prisma.teacherAssignment.create({
        data: {
          teacherId: teacher.id,
          gradeId: grades[gradeIndex].id,
          classId: classes[classIndex].id,
          subjectId: subjects[subjectIndex].id,
          year: 2023,
        },
      });
    })
  );

  console.log('Seeding completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });