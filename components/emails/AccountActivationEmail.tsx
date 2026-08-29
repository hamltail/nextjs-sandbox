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
    <Html lang="ja">
      <Head />
      <Preview>アカウントを有効化してください</Preview>

      <Body>
        <Container>
          <Heading>hamltail Web Lab</Heading>

          <Text>{name} さん</Text>

          <Text>
            hamltail Web Lab
            へのご登録ありがとうございます。以下のボタンからアカウントを有効化してください。
          </Text>

          <Section>
            <Button
              href={activationUrl}
              style={{
                backgroundColor: "#7c3aed",
                borderRadius: "9999px",
                color: "#ffffff",
                padding: "12px 24px",
                textDecoration: "none",
              }}
            >
              アカウントを有効化
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
