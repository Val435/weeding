export default function InfoCard({ icon: Icon, title, text }) {
return (
<div className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-neutral-200 p-5 shadow-sm">
<div className="flex items-center gap-3">
<div className="size-9 grid place-items-center rounded-full bg-neutral-900 text-white">
{Icon && <Icon className="size-4" />}
</div>
<div>
<p className="text-xs uppercase tracking-wide text-neutral-500">{title}</p>
<p className="text-sm font-medium">{text}</p>
</div>
</div>
</div>
);
}