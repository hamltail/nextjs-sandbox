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

type AccountActivationEmailProps = {
  name: string;
  activationUrl: string;
};

export default function AccountActivationEmail({
  name,
  activationUrl,
}: AccountActivationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Activate your account</Preview>

      <Body>
        <Container>
          <Heading>Next.js Sandbox</Heading>

          <Text>Hi {name},</Text>

          <Text>
            Welcome to Next.js Sandbox! Click the button below to activate your
            account:
          </Text>

          <Section>
            <Button
              href={activationUrl}
              style={{
                backgroundColor: "#14b8a6",
                borderRadius: "9999px",
                color: "#ffffff",
                padding: "12px 24px",
                textDecoration: "none",
              }}
            >
              Activate
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

AccountActivationEmail.PreviewProps = {
  name: "Hamru",
  activationUrl:
    "http://localhost:3000/account-activations/test-token?email=hamru@example.com",
} satisfies AccountActivationEmailProps;
