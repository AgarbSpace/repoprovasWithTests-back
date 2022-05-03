import joi from "joi"

const testSchema = joi.object({
    testTitle: joi.string().required(),
    pdfTest: joi.string().uri().required(),
    category: joi.string().required(),
    discipline: joi.string().required(),
    teacher: joi.string().required()
});

export default testSchema;