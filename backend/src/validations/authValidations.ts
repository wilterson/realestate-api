import * as yup from "yup";

export const signupSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  termsAccepted: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("Terms acceptance is required"),
  firstName: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .optional(),
  lastName: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .optional(),
  phoneNumber: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .optional(),
  about: yup
    .string()
    .max(1000, "About section must be less than 1000 characters")
    .optional(),
});
