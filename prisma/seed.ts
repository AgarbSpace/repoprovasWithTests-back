import {prisma} from "../src/database.js";

//async function main() {
	//upsert = update/insert
	//melhor que create por que pode dar conflito em campos unicos
	//await prisma.user.upsert({
        //where: { email: "teste@teste.com" },
        //update: {},
       // create: {
           // email: "teste@teste.com",
            //password: "123",
    //},
    //});
//}

//main()
    //.catch((e) => {
        //console.log(e);
       //process.exit(1);
   // })
   // .finally(async () => {
   // await prisma.$disconnect();
   // });