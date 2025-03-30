import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

export const loginSchema = Yup.object().shape({
  email: Yup.string().email().trim().required("Username is Required"),
  password: Yup.string().password().trim().required("Password Required"),
});

export default loginSchema;