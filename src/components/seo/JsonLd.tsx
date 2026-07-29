interface JsonLdProps {
  id?: string;
  data: Record<string, unknown> | readonly Record<string, unknown>[];
}

export function JsonLd({ id = "json-ld", data }: JsonLdProps) {
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
