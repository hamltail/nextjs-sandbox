import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();

// S3Client自体をモックし、R2への実通信を防ぐ。
// さらにsendをsendMockに差し替え、アップロード命令の呼び出しを検証できるようにする。
vi.mock("@aws-sdk/client-s3", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@aws-sdk/client-s3")>();

  return {
    ...actual,
    S3Client: vi.fn(
      class {
        send = sendMock;
      },
    ),
  };
});

describe("uploadImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    process.env.R2_ACCOUNT_ID = "test-account-id";
    process.env.R2_ACCESS_KEY_ID = "test-access-key-id";
    process.env.R2_SECRET_ACCESS_KEY = "test-secret-access-key";
    process.env.R2_BUCKET_NAME = "test-bucket";
  });

  it("JPEG画像をアップロードできる", async () => {
    const { uploadImage } = await import("./r2");

    const file = new File(["image-data"], "test.jpg", {
      type: "image/jpeg",
    });

    const key = await uploadImage(file);

    expect(sendMock).toHaveBeenCalledOnce();
    expect(key).toMatch(/^microposts\/.+\.jpg$/);
  });

  it("対応していないファイル形式は拒否する", async () => {
    const { uploadImage } = await import("./r2");

    const file = new File(["pdf-data"], "test.pdf", {
      type: "application/pdf",
    });

    await expect(uploadImage(file)).rejects.toThrow("Unsupported image type");

    expect(sendMock).not.toHaveBeenCalled();
  });

  it("1MBを超える画像は拒否する", async () => {
    const { uploadImage } = await import("./r2");

    const file = new File([new Uint8Array(1024 * 1024 + 1)], "large.jpg", {
      type: "image/jpeg",
    });

    await expect(uploadImage(file)).rejects.toThrow(
      "Image must be 1MB or smaller",
    );

    expect(sendMock).not.toHaveBeenCalled();
  });
});
