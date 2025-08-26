export default function GiftsSection() {
return (
<section id="regalos" className="mx-auto max-w-6xl px-4 py-16">
<h2 className="font-serif text-3xl">Regalos</h2>
<p className="mt-4 text-neutral-600 max-w-2xl">Su presencia es nuestro mejor regalo. Si desean hacernos un obsequio, pueden consultar nuestra lista sugerida o contribuir a nuestro viaje.</p>
<div className="mt-6 flex flex-wrap gap-3">
<a href="#" className="rounded-md px-5 py-3 text-sm ring-1 ring-neutral-300 hover:bg-neutral-50">Ver lista</a>
<a href="#" className="rounded-md px-5 py-3 text-sm ring-1 ring-neutral-300 hover:bg-neutral-50">Contribuir</a>
</div>
</section>
);
}