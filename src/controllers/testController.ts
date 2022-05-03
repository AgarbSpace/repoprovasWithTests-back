import { Request, Response } from "express";
import testService from "../services/testService.js";

async function find(req: Request, res: Response) {
  const { groupBy } = req.query as { groupBy: string };
  const { findBy } = req.query as { findBy: string};
  if (groupBy !== "disciplines" && groupBy !== "teachers") {
    console.log("vem aq")
    return res.sendStatus(400);
  }

  if(groupBy && findBy){
    const tests = await testService.findBy({groupBy}, findBy);
    return res.send({tests})
  }

  const tests = await testService.find({ groupBy });
  res.send({ tests });
}

async function addView(req: Request, res: Response){
  const { id } = req.body as {id: number};

  if(!id){
    return res.sendStatus(401)
  }

  await testService.sumViewInTest(id);
  res.sendStatus(200);
}

async function addTest(req: Request, res: Response){
  const testForm = req.body;
  await testService.addTest(testForm);

  res.sendStatus(201);
}

export default {
  find,
  addView,
  addTest
};
