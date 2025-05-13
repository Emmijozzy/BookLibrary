import * as Yup from 'yup';

export const DeleteAccountSchema = Yup.object().shape({
  confirmText: Yup.string()
    .matches(/^DELETE$/, 'Please type DELETE in all capitals')
    .required('Required confirmation'),
  password: Yup.string()
    .required('Password is required for account deletion'),
});