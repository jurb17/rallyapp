import * as yup from "yup";

// clients validation
export const clientProfileSchema = yup.object().shape({
  prefix: yup.string(),
  // .matches(
  //   /^[a-zA-Z0-9 .-]+$/,
  //   "Can only include letters, numbers, spaces, periods, and dashes"
  // )
  firstname: yup
    .string()
    // .matches(
    //   /^[a-zA-Z0-9 .-]+$/,
    //   "Can only include letters, numbers, spaces, periods, and dashes"
    // )
    .max(255, "Must be 255 characters or less")
    .required("First Name is required"),
  middlename: yup
    .string()
    // .matches(
    //   /^[a-zA-Z0-9 .-]+$/,
    //   "Can only include letters, numbers, spaces, periods, and dashes"
    // )
    .max(255, "Middle name has a max of 255 characters"),
  lastname: yup
    .string()
    // .matches(
    //   /^[a-zA-Z0-9 .-]+$/,
    //   "Can only include letters, numbers, spaces, periods, and dashes"
    // )
    .max(255, "Last has a max of 255 characters")
    .required("Last Name is required"),
  suffix: yup.string(),
  nickname: yup.string().max(40, "Nick name must be less than 40 characters"),
  phone: yup // OWASP
    .string()
    .matches(
      /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/,
      "Phone number must be 10 digits, with our without hyphens. Example: 555-555-5555"
    ),
  email: yup // OWASP
    .string()
    .matches(
      /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/,
      "Must be a valid email address"
    ),
});

export const customFieldValidationSchema = yup.object().shape({
  fieldname: yup
    .string()
    // .matches(
    //   /^[a-zA-Z0-9 .-]+$/,
    //   "Can only include letters, numbers, spaces, periods, and dashes"
    // )
    .required("Field Name is required")
    .max(32, "Field name must be less than 32 characters in length."),
  // type: yup.string().required("This is required"),
});

export const categoriesFormSchema = yup.object({
  category: yup
    .string()
    // .matches(
    //   /^[a-zA-Z0-9 .-]+$/,
    //   "Can only include letters, numbers, spaces, periods, and dashes"
    // )
    .required("Category is required"),
  subcategory: yup
    .string()
    // .matches(
    //   /^[a-zA-Z0-9 .-]+$/,
    //   "Can only include letters, numbers, spaces, periods, and dashes"
    // )
    .required("Subcategory is required"),
});

export const taskFormSchema = yup.object({
  name: yup
    .string()
    // .matches(
    //   /^[a-zA-Z0-9 .-]+$/,
    //   "Can only include letters, numbers, spaces, periods, and dashes"
    // )
    .max(80, "Name must be less than 80 characters")
    .required("Name is required")
    .matches(/^(?!\s+$).*/, "Name cannot be blank."),
  deliverable: yup
    .string()
    // .matches(
    //   /^[a-zA-Z0-9 .-]+$/,
    //   "Can only include letters, numbers, spaces, periods, and dashes"
    // )
    .required("Deliverable is required"),
});

export const NewInvoiceValidationSchema = yup.object().shape({
  description: yup
    .string("Please enter a valid description")
    // .matches(
    //   /^[a-zA-Z0-9 .-]+$/,
    //   "Can only include letters, numbers, spaces, periods, and dashes"
    // )
    .min(1, "Description must be at least 1 character.")
    .max(65, "Description must be less than 65 characters.")
    .matches(/^(?!\s+$).*/, "Description cannot be blank.")
    .required("Description is required."),
  attribute: yup
    .number("Amount must be a number.")
    .required("Amount is required.")
    .positive("Amount must be a positive number."),
});

// profile validation
export const customProfileFormSchema = yup.object({
  bio: yup
    .string()
    // .matches(
    //   /^[a-zA-Z0-9 .-,]+$/,
    //   "Can only include letters, numbers, spaces, periods, and dashes"
    // )
    .max(500, "Bio must be less than 500 characters")
    .required("Bio is required."),
  phone: yup // OWASP
    .string()
    .matches(
      /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/,
      "Phone number must be 10 digits, with our without hyphens. Example: 555-555-5555"
    ),
});

// check for valid URL - OWASP
export const checkValidURL = (str) => {
  const pattern = new RegExp(
    "^((((https?|ftps?|gopher|telnet|nntp)://)|(mailto:|news:))(%[0-9A-Fa-f]{2}|[-()_.!~*';/?:@&=+$,A-Za-z0-9])+)([).!';/?:,][[:blank:|:blank:]])?$"
  );
  return !!pattern.test(str);
};
