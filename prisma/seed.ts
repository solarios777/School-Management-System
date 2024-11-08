import { PrismaClient, UserSex } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Seed Subjects
    const subjects = [
        { name: 'Mathematics' },
        { name: 'Physics' },
        { name: 'Chemistry' },
        { name: 'Biology' },
        { name: 'History' },
        { name: 'Geography' },
        { name: 'English' },
        { name: 'Amharic' },
        { name: 'Computer Science' },
        { name: 'Music' },
    ];

    for (const subject of subjects) {
        await prisma.subject.create({
            data: subject,
        });
    }

    // Seed Teachers
    const teachers = [
        {
            username: 'teacher1',
            name: 'Mesfin',
            surname: 'Tadesse',
            email: 'mesfin.tadesse@example.com',
            phone: '0912345678',
            address: 'Addis Ababa',
            bloodType: 'O+',
            sex: UserSex.MALE, // Use the enum value
        },
        {
            username: 'teacher2',
            name: 'Amina',
            surname: 'Mohammed',
            email: 'amina.mohammed@example.com',
            phone: '0912345679',
            address: 'Addis Ababa',
            bloodType: 'A+',
            sex: UserSex.FEMALE, // Use the enum value
        },
        {
            username: 'teacher3',
            name: 'Biruk',
            surname: 'Hailu',
            email: 'biruk.hailu@example.com',
            phone: '0912345680',
            address: 'Addis Ababa',
            bloodType: 'B+',
            sex: UserSex.MALE, // Use the enum value
        },
        {
            username: 'teacher4',
            name: 'Marta',
            surname: 'Girma',
            email: 'marta.girma@example.com',
            phone: '0912345681',
            address: 'Addis Ababa',
            bloodType: 'AB+',
            sex: UserSex.FEMALE, // Use the enum value
        },
        {
            username: 'teacher5',
            name: 'Samuel',
            surname: 'Kebede',
            email: 'samuel.kebede@example.com',
            phone: '0912345682',
            address: 'Addis Ababa',
            bloodType: 'O-',
            sex: UserSex.MALE, // Use the enum value
        },
        {
            username: 'teacher6',
            name: 'Hana',
            surname: 'Ayele',
            email: 'hana.ayele@example.com',
            phone: '0912345683',
            address: 'Addis Ababa',
            bloodType: 'A-',
            sex: UserSex.FEMALE, // Use the enum value
        },
        {
            username: 'teacher7',
            name: 'Tewodros',
            surname: 'Fikru',
            email: 'tewodros.fikru@example.com',
            phone: '0912345684',
            address: 'Addis Ababa',
            bloodType: 'B-',
            sex: UserSex.MALE, // Use the enum value
        },
        {
            username: 'teacher8',
            name: 'Selam',
            surname: 'Zerihun',
            email: 'selam.zerihun@example.com',
            phone: '0912345685',
            address: 'Addis Ababa',
            bloodType: 'O+',
            sex: UserSex.FEMALE, // Use the enum value
        },
        {
            username: 'teacher9',
            name: 'Dawit',
            surname: 'Teshome',
            email: 'dawit.teshome@example.com',
            phone: '0912345686',
            address: 'Addis Ababa',
            bloodType: 'A+',
            sex: UserSex.MALE, // Use the enum value
        },
        {
            username: 'teacher10',
            name: 'Kalkidan',
            surname: 'Assefa',
            email: 'kalkidan.assefa@example.com',
            phone: '0912345687',
            address: 'Addis Ababa',
            bloodType: 'AB-',
            sex: UserSex.FEMALE, // Use the enum value
        },
        {
            username: 'teacher11',
            name: 'Rahel',
            surname: 'Mulugeta',
            email: 'rahel.mulugeta@example.com',
            phone: '0912345688',
            address: 'Addis Ababa',
            bloodType: 'O+',
            sex: UserSex.FEMALE, // Use the enum value
        },
        {
            username: 'teacher12',
            name: 'Yared',
            surname: 'Tiruneh',
            email: 'yared.tiruneh@example.com',
            phone: '0912345689',
            address: 'Addis Ababa',
            bloodType: 'A+',
            sex: UserSex.MALE, // Use the enum value
        },
        {
            username: 'teacher13',
            name: 'Eden',
            surname: 'Alemayehu',
            email: 'eden.alemayehu@example.com',
            phone: '0912345690',
            address: 'Addis Ababa',
            bloodType: 'B+',
            sex: UserSex.FEMALE, // Use the enum value
        },
        {
            username: 'teacher14',
            name: 'Meskerem',
            surname: 'Tiruneh',
            email: 'meskerem.tiruneh@example.com',
            phone: '0912345691',
            address: 'Addis Ababa',
            bloodType: 'AB+',
            sex: UserSex.FEMALE, // Use the enum value
        },
        {
            username: 'teacher15',
            name: 'Mulu',
            surname: 'Gebremariam',
            email: 'mulu.gebremariam@example.com',
            phone: '0912345692',
            address: 'Addis Ababa',
            bloodType: 'O-',
            sex: UserSex.MALE, // Use the enum value
        },
    ];

    for (const teacher of teachers) {
        await prisma.teacher.create({
            data: teacher,
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });