import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const registrationSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .required("Fullname is required.")
    .min(3, "Fullname must be at least 3 characters long."),
  email: Yup.string().trim().required("Email is required.").email("Invalid email address"),
  password: Yup.string().password().required(),
  confirmPassword: Yup.string()
    .required("Confirm Password is required.")
    .oneOf([Yup.ref("password")], "Confirm Password does not match your password."),
});