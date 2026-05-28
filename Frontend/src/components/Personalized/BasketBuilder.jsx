import React from 'react';

const Icon = ({ children, className = 'h-5 w-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const BasketBuilder = ({
  basket, // This is the image asset
  basketItems,
  categories,
  activeCategory,
  onCategoryChange,
  products,
  selectedItems,
  basketTotal,
  basketWeight,
  itemCount,
  basketQuantity,
  onQuantityChange,
  onAddItem,
  onUpdateItemQuantity,
  onClearBasket,
  onGenerateAI,
  isGenerating,
  onAddToCart,
  onWhatsApp,
  formatPrice,
  aiGeneratedImages,
}) => {
  const payableTotal = basketTotal * basketQuantity;

  return (
    <section className="mb-16 sm:mb-24 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
      <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start lg:items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff2f2] border border-[#ffe0e0] text-[#760000] shadow-sm">
            <Icon className="h-7 w-7">
              <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" />
              <path d="M2 7h20v5H2z" />
              <path d="M12 22V7" />
              <path d="M12 7H7.5A2.5 2.5 0 1 1 10 4.5c0 1.4 2 2.5 2 2.5Z" />
              <path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5c0 1.4-2 2.5-2 2.5Z" />
            </Icon>
          </span>
          <div>
            <h2 className="font-serif text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
              Build Your Gift Basket
            </h2>
            <p className="font-sans text-sm text-gray-500 mt-1">
              Add favorite gifts and watch your custom basket update in real time.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClearBasket}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.12em] text-gray-600 transition-all duration-300 hover:border-red-200 hover:text-red-700 hover:scale-[1.03]"
          >
            <Icon className="h-4 w-4">
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="m19 6-.8 14H5.8L5 6" />
              <path d="M10 11v5" />
              <path d="M14 11v5" />
            </Icon>
            Clear Basket
          </button>
          <button
            type="button"
            onClick={onWhatsApp}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.12em] text-white border border-[#20bd5a] shadow-[0_6px_16px_rgba(37,211,102,0.2)] transition-all duration-300 hover:bg-[#20bd5a] hover:scale-[1.03]"
          >
            Order on WhatsApp
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div className="grid min-h-[450px] lg:min-h-[620px] grid-cols-1 lg:grid-cols-[360px_1fr]">
        <aside className="border-b border-gray-100 bg-white p-5 sm:p-7 lg:border-b-0 lg:border-r">
          <h3 className="micro-label mb-5 text-gray-900">Choose Gifts</h3>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`shrink-0 rounded-full px-4 py-2 font-sans text-xs font-semibold transition-all duration-300 ${activeCategory === category
                  ? 'bg-[#760000] text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-4">
            {products.map((item) => (
              <article
                key={item.id}
                className="group rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl p-3 shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(118,0,0,0.15)]"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-white to-red-50/40 p-3">
                  <div className="absolute inset-0 rounded-2xl bg-white/40 blur-2xl" />
                  <img
                    src={item.image}
                    alt={item.name}
                    className="relative z-10 h-full w-full object-contain drop-shadow-[0_18px_25px_rgba(0,0,0,0.22)] transition-all duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="pt-3">
                  <h4 className="font-sans text-[13px] font-semibold leading-snug text-gray-900">{item.name}</h4>
                  <p className="mt-1 font-sans text-xs text-gray-500">{formatPrice(item.price)}</p>
                  <button
                    type="button"
                    onClick={() => onAddItem(item)}
                    disabled={isGenerating || aiGeneratedImages.length > 0}
                    className={`mt-3 flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${(isGenerating || aiGeneratedImages.length > 0)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#760000] text-white hover:bg-red-800 hover:scale-[1.03]'
                      }`}
                  >
                    <span aria-hidden="true">+</span>
                    Add
                  </button>
                </div>
              </article>
            ))}
          </div>
        </aside>

        <div className="relative flex min-h-[450px] lg:min-h-[620px] flex-col overflow-hidden bg-gradient-to-br from-[#fff8ed] via-[#fffaf4] to-[#ffe9d6]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(255,248,237,0.75)_42%,_rgba(246,216,171,0.28))]" />

          <div className="relative z-10 mx-auto mt-5 flex max-w-xl items-start gap-4 rounded-xl border border-red-100 bg-white/75 px-5 py-4 text-[#5d1b1b] shadow-sm backdrop-blur-xl">
            <span className="text-2xl" aria-hidden="true">✦</span>
            <p className="font-sans text-sm leading-relaxed">
              Add items from the left panel to build your perfect gift basket. Remove or adjust
              quantities anytime.
            </p>
          </div>

          <div className="relative z-10 flex flex-1 items-center justify-center px-2 py-6">
            <div className="relative w-[135%] sm:w-full max-w-[1050px]" style={{ aspectRatio: '1050 / 550', height: 'auto' }}>
              <div className="absolute left-[6%] top-[8%] text-2xl animate-pulse">✨</div>
              <div className="absolute right-[6%] top-[12%] text-xl animate-bounce">💖</div>
              <div className="absolute left-[14%] bottom-[18%] text-lg animate-pulse">✨</div>
              <div className="absolute bottom-[2%] left-1/2 h-16 w-[70%] -translate-x-1/2 rounded-full bg-black/25 blur-3xl" />

              <div className={`relative h-full w-full transition-all duration-700 ${isGenerating ? 'blur-md opacity-40 scale-95' : ''}`}>
                <img
                  src={basket}
                  alt="Basket"
                  className="absolute bottom-0 left-1/2 z-20 w-full -translate-x-1/2 object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.28)]"
                />

                {selectedItems.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '30%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '68%',
                      height: '52%',
                      zIndex: 30,
                    }}
                  >
                    {selectedItems.map((item, idx) => {
                      const baseSize = selectedItems.length === 1 ? 48 :
                        selectedItems.length === 2 ? 38 :
                          selectedItems.length === 3 ? 34 : 28;
                      const scale = baseSize + (item.id.length % 5);

                      let slot;
                      if (selectedItems.length === 1) {
                        slot = { left: '50%', bottom: '36%', rotate: '0deg', z: 40 };
                      } else {
                        const scatteredSlots = [
                          { left: '32%', bottom: '30%', rotate: '-10deg', z: 35 },
                          { left: '68%', bottom: '38%', rotate: '8deg', z: 32 },
                          { left: '48%', bottom: '24%', rotate: '0deg', z: 38 },
                          { left: '26%', bottom: '48%', rotate: '-4deg', z: 31 },
                          { left: '74%', bottom: '52%', rotate: '12deg', z: 33 },
                          { left: '52%', bottom: '58%', rotate: '-6deg', z: 30 },
                          { left: '38%', bottom: '56%', rotate: '4deg', z: 29 },
                          { left: '62%', bottom: '26%', rotate: '-12deg', z: 36 },
                        ];
                        slot = scatteredSlots[idx % scatteredSlots.length];
                      }

                      return (
                        <div
                          key={item.id}
                          style={{
                            position: 'absolute',
                            left: slot.left,
                            bottom: slot.bottom,
                            width: `${scale}%`,
                            zIndex: slot.z,
                            transform: `translateX(-50%) rotate(${slot.rotate})`,
                          }}
                          className="transition-all duration-700 ease-out"
                        >
                          <img
                            src={item.image}
                            alt=""
                            className="relative z-10 w-full object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.32)] transition-transform duration-500 hover:scale-105"
                          />
                          {item.quantity > 1 && (
                            <span className="absolute right-[25%] top-[25%] z-50 flex h-6 w-6 items-center justify-center rounded-full bg-[#760000] text-[10px] font-bold text-white shadow-lg border-2 border-white/80">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-1 m-4 rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.08)] sm:m-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl" aria-hidden="true">🧺</span>
                <div>
                  <p className="font-sans text-sm font-bold text-gray-900">
                    {itemCount} item{itemCount === 1 ? '' : 's'} in your basket
                  </p>
                  <p className="mt-1 font-sans text-xs text-gray-500">
                    Total weight: {basketWeight.toFixed(1)} kg approx.
                  </p>
                </div>
              </div>

              <div className="border-gray-100 lg:border-l lg:px-8">
                <p className="micro-label text-gray-400">Total Price</p>
                <p className="font-sans text-2xl font-extrabold text-[#760000]">{formatPrice(payableTotal)}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="inline-grid h-11 w-36 grid-cols-3 overflow-hidden rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => onQuantityChange(Math.max(1, basketQuantity - 1))}
                    className="font-bold text-gray-500 hover:bg-gray-50 transition-all duration-300 hover:scale-[1.03]"
                  >
                    −
                  </button>
                  <span className="flex items-center justify-center border-x border-gray-100 font-sans text-sm font-bold">
                    {basketQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuantityChange(basketQuantity + 1)}
                    className="font-bold text-gray-500 hover:bg-gray-50 transition-all duration-300 hover:scale-[1.03]"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onGenerateAI}
                  disabled={isGenerating || selectedItems.length === 0}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#760000] bg-white px-5 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#760000] shadow-sm transition-all duration-300 hover:bg-red-50 hover:scale-[1.03] disabled:opacity-30"
                >
                  <Icon className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`}>
                    <path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" />
                  </Icon>
                  {isGenerating ? 'Crafting...' : 'Look at your hamper'}
                </button>
                <button
                  type="button"
                  onClick={onAddToCart}
                  className="inline-flex h-11 min-w-[180px] items-center justify-center gap-2 rounded-xl bg-[#760000] px-5 font-sans text-xs font-bold uppercase tracking-[0.12em] text-white shadow-md transition-all duration-300 hover:bg-red-800 hover:scale-[1.03]"
                >
                  <Icon className="h-4 w-4">
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h8.78a2 2 0 0 0 1.95-1.57L21 8H5.12" />
                  </Icon>
                  Add to Cart
                </button>
              </div>
            </div>

            {selectedItems.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                {selectedItems.map((item) => (
                  <div key={item.id} className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50/60 px-3 py-1.5">
                    <span>{item.emoji}</span>
                    <span className="font-sans text-xs font-semibold text-gray-800">{item.name}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateItemQuantity(item.id, item.quantity - 1)}
                      className="text-gray-400 hover:text-red-700 transition-all duration-300 hover:scale-[1.03]"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasketBuilder;
