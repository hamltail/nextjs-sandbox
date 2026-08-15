type AccountActivationEmailProps = {
  name: string;
  activationUrl: string;
};

export default function AccountActivationEmail({
  name,
  activationUrl,
}: AccountActivationEmailProps) {
  return (
    <div>
      <h1>Next.js Sandbox</h1>

      <p>Hi {name},</p>

      <p>
        Welcome to Next.js Sandbox! Click on the link below to activate your
        account:
      </p>

      <p>
        <a href={activationUrl}>Activate</a>
      </p>
    </div>
  );
}
