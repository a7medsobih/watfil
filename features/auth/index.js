export { default as AuthDialog } from "./components/AuthDialog";
export { default as AuthBootstrap } from "./components/AuthBootstrap";
export { default as AuthQueryOpener } from "./components/AuthQueryOpener";
export { default as LoginPage } from "./components/LoginPage";
export { default as RegisterPage } from "./components/RegisterPage";
export { default as ForgotPasswordPage } from "./components/ForgotPasswordPage";
export { default as ResetPasswordPage } from "./components/ResetPasswordPage";
export { useRequireAuth } from "./hooks/use-require-auth";
export {
  checkPhone,
  loginCustomer,
  registerCustomer,
  requestRegisterOtp,
  verifyRegister,
  logoutCustomer,
  getCustomerMe,
  updateCustomerProfile,
  normalizePhone,
  isValidEgyptianPhone,
} from "./api/customer-auth";
export { resolveRegisterCompany } from "./utils/resolve-register-company";
