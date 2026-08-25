export type SendAccountActivationEmailParams = {
  name: string;
  email: string;
  activationToken: string;
};

export type SendAccountActivationEmail = (
  params: SendAccountActivationEmailParams,
) => Promise<void>;
