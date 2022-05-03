import { prisma } from "../database.js";
import { TestForm } from "../services/testService.js";

async function getTestsByDiscipline() {
  return prisma.term.findMany({
    include: {
      disciplines: {
        include: {
          teacherDisciplines: {
            include: {
              teacher: true,
              tests: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function getTestsByDisciplineName(discipline: string) {
  return prisma.term.findMany({
    include: {
      disciplines: {
        where:{
          name: discipline
        },
        include: {
          teacherDisciplines: {
            include: {
              teacher: true,
              tests: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function getTestsByTeachers() {
  return prisma.teacherDiscipline.findMany({
    include: {
      teacher: true,
      discipline: true,
      tests: {
        include: {
          category: true,
        },
      },
    },
  });
}
async function getTestsByTeacherName(teacher: string) {
  return prisma.teacherDiscipline.findMany({
    include: {
      teacher: true,
      discipline: true,
      tests: {
        include: {
          category: true,
        },
      },
    },
  });
}

async function sumView(id: number){
  const numberOfViews = await prisma.test.findUnique({
    where: {
      id: id
    }
  });

  return prisma.test.update({
    where: {
      id: id
    },
    data: {
      view: numberOfViews.view + 1
    }
  })
}

async function addTest(testForm: TestForm){
  const category = await prisma.category.findUnique({
    where: {
      name: testForm.category
    }
  });

  const discipline = await prisma.discipline.findUnique({
    where:{
        name: testForm.discipline
    }
  });

  const teacher = await prisma.teacher.findUnique({
    where: {
      name: testForm.teacher
    }
  });

  const teacherDiscipline = await prisma.teacherDiscipline.findMany({
    where:{
      teacherId: teacher.id,
      disciplineId: discipline.id
    }
  })


  return prisma.test.create({
    data: {
      name: testForm.testTitle,
      pdfUrl: testForm.pdfTest,
      categoryId: category.id,
      teacherDisciplineId: teacherDiscipline[0].id
    },
  });

}

export default {
  getTestsByDiscipline,
  getTestsByTeachers,
  sumView,
  addTest,
  getTestsByDisciplineName,
  getTestsByTeacherName
};
