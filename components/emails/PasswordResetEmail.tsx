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
    <Html lang="ja">
      <Head />
      <Preview>パスワード再設定のご案内</Preview>

      <Body>
        <Container>
          <Heading>hamltail Web Lab</Heading>

          <Text>
            パスワードを再設定するには、以下のボタンをクリックしてください。
          </Text>

          <Section>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: "#7c3aed",
                borderRadius: "9999px",
                color: "#ffffff",
                padding: "12px 24px",
                textDecoration: "none",
              }}
            >
              パスワードを再設定
            </Button>
          </Section>

          <Text>このリンクの有効期限は2時間です。</Text>

          <Text>
            パスワード再設定を申請していない場合は、このメールを破棄してください。
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
