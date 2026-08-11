import Image from "next/image";

export function SelfieGuideCard() {
  return (
    <section className="rounded-[30px] border border-white/70 bg-white/78 p-5 shadow-[0_18px_48px_rgba(17,24,39,0.06)] backdrop-blur sm:p-6">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_180px] md:items-center">
        <div className="space-y-3">
          <h2 className="text-[19px] font-light tracking-[-0.03em] text-ink sm:text-[22px]">
            Как сделать фото
          </h2>
          <p className="max-w-[42rem] text-sm font-light leading-7 text-slate-600 sm:text-[15px]">
            Сделайте фото анфас при хорошем освещении, держите голову ровно и не закрывайте лицо волосами.
          </p>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white">
          <Image
            src="/guide/selfie-guide.png"
            alt="Подсказка для селфи"
            width={360}
            height={360}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}