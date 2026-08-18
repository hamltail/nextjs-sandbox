import Image from "next/image";

type MicropostItemProps = {
  micropost: {
    id: string;
    content: string;
    imageKey: string | null;
    createdAt: Date;
  };
  action?: React.ReactNode;
};

export default function MicropostItem({
  micropost,
  action,
}: MicropostItemProps) {
  return (
    <article className="flex items-start justify-between gap-4 py-6">
      <div className="min-w-0 flex-1">
        <p className="whitespace-pre-wrap">{micropost.content}</p>

        {micropost.imageKey && (
          <Image
            src={`${process.env.R2_PUBLIC_URL}/${micropost.imageKey}`}
            alt="Micropost image"
            width={800}
            height={600}
            className="mt-4 rounded-xl object-cover"
          />
        )}

        <p className="mt-3 text-sm text-gray-500">
          {micropost.createdAt.toLocaleString("ja-JP")}
        </p>
      </div>

      {action}
    </article>
  );
}
