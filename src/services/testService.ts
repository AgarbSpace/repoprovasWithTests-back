import testRepository from "../repositories/testRepository.js";
import { wrongSchemaError } from "../utils/errorUtils.js";

interface Filter {
  groupBy: "disciplines" | "teachers";
}
export interface TestForm{
  testTitle: string;
  pdfTest: string;
  category: string;
  discipline: string;
  teacher: string
}

async function find(filter: Filter) {
  if (filter.groupBy === "disciplines") {
    return testRepository.getTestsByDiscipline();
  } else if (filter.groupBy === "teachers") {
    return testRepository.getTestsByTeachers();
  }
}

async function findBy(filter: Filter, name: string) {
  if (filter.groupBy === "disciplines") {
    return testRepository.getTestsByDisciplineName(name);
  } else if (filter.groupBy === "teachers") {
    return testRepository.getTestsByTeacherName(name);
  }
}

async function sumViewInTest(id: number){
  return testRepository.sumView(id);
}

async function addTest(testForm: TestForm){
  const testAdded = await testRepository.addTest(testForm);

  if(!testAdded){
    throw wrongSchemaError("Invalid Credentials");
  }

  return testAdded;
}

export default {
  find,
  sumViewInTest,
  addTest,
  findBy
};
