import { createUserSchema } from "../app/lib/validations/user";

const testCases = [
  {
    title: "正常なユーザー",
    input: {
      name: "Example User",
      email: "user@example.com",
    },
  },
  {
    title: "名前が空",
    input: {
      name: "",
      email: "user@example.com",
    },
  },
  {
    title: "名前が空白のみ",
    input: {
      name: "     ",
      email: "user@example.com",
    },
  },
  {
    title: "名前が51文字",
    input: {
      name: "a".repeat(51),
      email: "user@example.com",
    },
  },
  {
    title: "メール形式が不正",
    input: {
      name: "Example User",
      email: "abc",
    },
  },
];

for (const testCase of testCases) {
  console.log(`\n=== ${testCase.title} ===`);

  const result = createUserSchema.safeParse(testCase.input);

  console.dir(result, {
    depth: null,
  });
}
