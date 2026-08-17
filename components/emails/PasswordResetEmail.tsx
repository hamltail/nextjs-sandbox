import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type PasswordResetEmailProps = {
  resetUrl: string;
};

export default function PasswordResetEmail({
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Password reset</Preview>

      <Body>
        <Container>
          <Heading>Password reset</Heading>

          <Text>To reset your password, click the button below.</Text>

          <Section>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: "#14b8a6",
                borderRadius: "9999px",
                color: "#ffffff",
                padding: "12px 24px",
                textDecoration: "none",
              }}
            >
              Reset password
            </Button>
          </Section>

          <Text>This link will expire in two hours.</Text>

          <Text>
            If you did not request a password reset, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

PasswordResetEmail.PreviewProps = {
  resetUrl:
    "http://localhost:3000/password-resets/test-token?email=hamru@example.com",
} satisfies PasswordResetEmailProps;
