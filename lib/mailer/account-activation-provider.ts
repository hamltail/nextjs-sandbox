import { sendAccountActivationEmail } from "./account-activation";
import { sendAccountActivationEmailMock } from "./account-activation-mock";

export const accountActivationMailer =
  process.env.PERFORMANCE_TEST === "true"
    ? sendAccountActivationEmailMock
    : sendAccountActivationEmail;
