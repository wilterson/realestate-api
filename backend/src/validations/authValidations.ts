import * as yup from "yup";

export const signupSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Name is required")
    .test(
      "name-format",
      "Name must contain at least first and last name",
      function (value) {
        if (!value) return false;
        const nameParts = value.trim().split(/\s+/);
        return (
          nameParts.length >= 2 && nameParts.every((part) => part.length >= 2)
        );
      }
    ),
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
  phoneNumber: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .optional(),
  about: yup
    .string()
    .max(1000, "About section must be less than 1000 characters")
    .optional(),
});
