import * as yup from "yup";
import { addValidationRules } from "./ValidationRules";

function createYupSchema(schema, data) {
  const { id, validationType, criteria } = data;
  // console.log("ABUNCH OFSTUFF", id, validationType, criteria);
  if (!yup[validationType]) {
    // validationType is one of ['string', 'number', 'boolean', 'array', 'object', 'date']
    // console.log(
    //   "There's no yup validation type for this validationType",
    //   validationType
    // );
    return schema;
  }
  let validator = yup[validationType]();
  criteria.forEach((rule) => {
    // each rule should be in the form of { type:"", params:[limit, "message"] }
    const { params, type } = rule;
    if (!validator[type]) {
      return;
    }
    validator = validator[type](...params);
  });
  schema[id] = validator; // schema[id] is a yup schema object
  return schema;
}
// translate our current field types to a new number system.
const createValidationData = (questions) => {
  // console.log("questions", questions);
  let validationData = [];
  questions.forEach((question) => {
    // console.log("questions", question);
    let tempObject = {};
    const { valType, rules } = addValidationRules(question.dtype, []);
    tempObject = {
      id: question.id,
      validationType: valType,
      criteria: [...rules],
    };
    // console.log("tempObject", tempObject);
    validationData.push(tempObject);
  });
  // console.log("validationData", validationData);
  return validationData;
};
// function to call both of the previous functions
export const buildValidationSchema = (questions) => {
  const validationData = createValidationData(questions);
  const yupSchema = validationData.reduce(createYupSchema, {});
  // console.log(yupSchema);
  const validationSchema = yup.object().shape(yupSchema);
  return validationSchema;
};
