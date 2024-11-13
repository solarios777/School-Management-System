import { PrismaClient, UserRole, UserSex } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Admin
  const admin = await prisma.admin.create({
    data: {
      username: 'adminUser',
      password: 'securePassword123',
      role: UserRole.ADMIN,
    },
  });

  // Create Users
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: 'password123',
      name: 'John Doe',
    },
  });

  // Create Students
  const student = await prisma.student.create({
    data: {
      username: 'studentUser',
      name: 'Alice',
      surname: 'Smith',
      email: 'alice@example.com',
      phone: '1234567890',
      address: '123 Main St',
      bloodType: 'O+',
      sex: UserSex.FEMALE,
      birthday: new Date('2005-05-15'),
      password: 'studentPassword',
    },
  });

  // Create Teachers
  const teacher = await prisma.teacher.create({
    data: {
      username: 'teacherUser',
      name: 'Mr. Brown',
      surname: 'Brown',
      email: 'mr.brown@example.com',
      phone: '0987654321',
      address: '456 Elm St',
      bloodType: 'A+',
      sex: UserSex.MALE,
      birthday: new Date('1980-03-20'),
      password: 'teacherPassword',
    },
  });

  // Create Parents
//   const parent = await prisma.parent.create({
//     data: {
//       username: 'parentUser',
//       name: 'Mrs. Johnson',
//       surname: 'Johnson',
//       email: 'mrs.johnson@example.com',
//       phone: '1112223333',
//       address: '789 Oak St',
//       password: 'parentPassword',
//     },
//   });

  // Create Grades
  const grade = await prisma.grade.create({
    data: {
      level: 5,
    },
  });

  // Create Classes
  const class1 = await prisma.class.create({
    data: {
      name: '5th Grade',
      capacity: 30,
    },
  });

  // Create Subjects
  const subject = await prisma.subject.create({
    data: {
      name: 'Mathematics',
    },
  });

  // Create Assignments
  const assignment = await prisma.assignment.create({
    data: {
      title: 'Math Homework',
      startDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    },
  });

  // Create Events
  const event = await prisma.event.create({
    data: {
      title: 'Parent-Teacher Conference',
      description: 'Discuss student progress',
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours long
      classId: class1.id,
    },
  });

  // Create Announcements
  const announcement = await prisma.announcement.create({
    data: {
      title: 'School Closure',
      description: 'School will be closed on Friday for maintenance.',
      date: new Date(),
      classId: class1.id,
    },
  });

  console.log({ admin, user, student, teacher, parent, grade, class1, subject, assignment, event, announcement });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });