export const SectionHeading = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) => (
  <div className="max-w-2xl">
    {eyebrow ? (
      <p className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
        {eyebrow}
      </p>
    ) : null}
    <h2 className="section-title">{title}</h2>
    {description ? <p className="mt-4 text-base text-slate-600">{description}</p> : null}
  </div>
);
