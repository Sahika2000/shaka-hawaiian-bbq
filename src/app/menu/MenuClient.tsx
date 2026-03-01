'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { useCartDrawer } from '@/components/CartDrawer';
import { formatPrice, dollarsToCents } from '@/lib/utils';
import type { MenuCategory, MenuItem } from '@prisma/client';
import styles from './menu.module.css';

type CategoryWithItems = MenuCategory & { items: MenuItem[] };

interface Props {
  categories: CategoryWithItems[];
}

// ─── Family Meal entrée options with upcharge in cents ───────────────────────
interface EntreeOption {
  label: string;
  upchargeCents: number;
}

const FAMILY_MEAL_ENTREES: EntreeOption[] = [
  { label: 'BBQ Chicken',                          upchargeCents: 0    },
  { label: 'Chicken Katsu',                        upchargeCents: 0    },
  { label: 'Teriyaki Chicken',                     upchargeCents: 0    },
  { label: 'Fire Chicken',                         upchargeCents: 0    },
  { label: 'Kalua Pork',                           upchargeCents: 0    },
  { label: 'Fried White Fish',                     upchargeCents: 0    },
  { label: 'Curry Chicken',                        upchargeCents: 0    },
  { label: 'Curry Chicken Katsu',                  upchargeCents: 0    },
  { label: 'Grilled Chicken Breast - Lemon Pepper',upchargeCents: 300  },
  { label: 'Grilled Chicken Breast - Teriyaki',    upchargeCents: 300  },
  { label: 'BBQ Beef',                             upchargeCents: 300  },
  { label: 'Crispy Shrimp',                        upchargeCents: 300  },
  { label: 'Kalbi Short Ribs',                     upchargeCents: 600  },
];

// ─── MenuClient ───────────────────────────────────────────────────────────────
export function MenuClient({ categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? '');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className={styles.page}>
      <nav className={styles.catNav} aria-label="Menu categories">
        <div className={styles.catNavInner}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.catNavBtn} ${activeCategory === cat.id ? styles.active : ''}`}
              onClick={() => {
                setActiveCategory(cat.id);
                document.getElementById(cat.name)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      <div className="container">
        <div className={styles.pageHeader}>
          <h1>Our Menu</h1>
          <p>Fresh Hawaiian BBQ made with aloha — available for pickup at our Colony location.</p>
        </div>

        {categories.map((cat) => (
          <section key={cat.id} id={cat.name} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{cat.name}</h2>
            <div className={styles.itemGrid}>
              {cat.items.map((item) => (
                <MenuItemCard key={item.id} item={item} onAdded={showToast} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {toast && <div className="toast success" role="alert">{toast}</div>}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isFamilyMeal(item: MenuItem): boolean {
  return item.name.toLowerCase().includes('family meal');
}

function entreeLabel(opt: EntreeOption): string {
  return opt.upchargeCents > 0
    ? `${opt.label} +$${(opt.upchargeCents / 100).toFixed(2)}`
    : opt.label;
}

// ─── Family Meal Modal ────────────────────────────────────────────────────────
interface FamilyMealModalProps {
  item: MenuItem;
  onClose: () => void;
  onAdded: (msg: string) => void;
}

function FamilyMealModal({ item, onClose, onAdded }: FamilyMealModalProps) {
  const { addItem } = useCart();
  const basePriceCents = dollarsToCents(Number(item.basePrice));

  const [quantity, setQuantity] = useState(1);
  const [choices, setChoices] = useState<[string, string, string]>(['', '', '']);

  const setChoice = (slotIndex: number, value: string) => {
    setChoices((prev) => {
      const next = [...prev] as [string, string, string];
      next[slotIndex] = value;
      return next;
    });
  };

  const allChosen = choices.every((c) => c !== '');

  // Calculate total upcharge from selected entrées
  const upchargeCents = choices.reduce((sum, label) => {
    const opt = FAMILY_MEAL_ENTREES.find((e) => e.label === label);
    return sum + (opt?.upchargeCents ?? 0);
  }, 0);

  const totalUnitCents = basePriceCents + upchargeCents;

  const handleAddToCart = () => {
    if (!allChosen) return;
    const selectedOption = `${choices[0]} / ${choices[1]} / ${choices[2]}`;
    addItem({
      menuItemId: item.id,
      name: item.name,
      unitPriceCents: totalUnitCents,
      quantity,
      selectedOption,
    });
    onAdded(`Added ${item.name} to cart`);
    onClose();
  };

  const SLOT_LABELS = ['Choice of 1st Item', 'Choice of 2nd Item', 'Choice of 3rd Item'];

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <h3>{item.name}</h3>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Description */}
        {item.description && (
          <p className={styles.modalDesc}>{item.description}</p>
        )}

        {/* Quantity */}
        <div className={styles.qtyRow}>
          <span className={styles.qtyLabel}>Quantity:</span>
          <div className={styles.qtyControls}>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >−</button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >+</button>
          </div>
        </div>

        {/* 3 entrée choice slots */}
        {SLOT_LABELS.map((slotLabel, slotIdx) => (
          <div key={slotIdx} className={styles.entreeSlot}>
            <div className={styles.entreeSlotHeader}>
              <span className={styles.entreeSlotTitle}>{slotLabel}</span>
              <span className={styles.entreeSlotRequired}>1 required</span>
            </div>
            <div className={styles.entreeGrid}>
              {FAMILY_MEAL_ENTREES.map((opt) => {
                const checked = choices[slotIdx] === opt.label;
                return (
                  <label
                    key={opt.label}
                    className={`${styles.entreeOption} ${checked ? styles.entreeOptionChecked : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setChoice(slotIdx, checked ? '' : opt.label)}
                      className={styles.entreeCheckbox}
                    />
                    <span className={styles.entreeOptionText}>
                      {opt.label}
                      {opt.upchargeCents > 0 && (
                        <span className={styles.upcharge}>
                          {' '}+${(opt.upchargeCents / 100).toFixed(2)}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Add to cart button */}
        <div className={styles.modalFooter}>
          {upchargeCents > 0 && (
            <p className={styles.upchargeNote}>
              Includes +${(upchargeCents / 100).toFixed(2)} for premium selections
            </p>
          )}
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem', padding: '14px' }}
            onClick={handleAddToCart}
            disabled={!allChosen}
          >
            {allChosen
              ? `Add to Cart — ${formatPrice(totalUnitCents * quantity)}`
              : `Select all 3 entrées to continue`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Standard single-choice modal ────────────────────────────────────────────
interface StandardModalProps {
  item: MenuItem;
  choices: string[];
  onClose: () => void;
  onAdded: (msg: string) => void;
}

function StandardModal({ item, choices, onClose, onAdded }: StandardModalProps) {
  const { addItem } = useCart();
  const priceCents = dollarsToCents(Number(item.basePrice));
  const [selectedOption, setSelectedOption] = useState('');

  const handleAdd = () => {
    if (!selectedOption) return;
    addItem({
      menuItemId: item.id,
      name: item.name,
      unitPriceCents: priceCents,
      quantity: 1,
      selectedOption,
    });
    onAdded(`Added ${item.name} to cart`);
    onClose();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{item.name}</h3>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <p className={styles.modalPrompt}>Select your choice:</p>
        <div className={styles.choiceList}>
          {choices.map((choice) => (
            <label key={choice} className={styles.choiceItem}>
              <input
                type="radio"
                name="option"
                value={choice}
                checked={selectedOption === choice}
                onChange={() => setSelectedOption(choice)}
              />
              <span>{choice}</span>
            </label>
          ))}
        </div>
        <button
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
          onClick={handleAdd}
          disabled={!selectedOption}
        >
          Add to Cart — {formatPrice(priceCents)}
        </button>
      </div>
    </div>
  );
}

// ─── MenuItemCard ─────────────────────────────────────────────────────────────
function MenuItemCard({ item, onAdded }: { item: MenuItem; onAdded: (msg: string) => void }) {
  const { addItem } = useCart();
  const [showModal, setShowModal] = useState(false);

  const options = item.options as { protein_choices?: string[]; entree_choices?: string[] } | null;
  const standardChoices = options?.protein_choices ?? options?.entree_choices ?? [];
  const priceCents = dollarsToCents(Number(item.basePrice));
  const isFamily = isFamilyMeal(item);
  const hasChoices = isFamily || standardChoices.length > 0;

  const handleAddClick = () => {
    if (hasChoices) {
      setShowModal(true);
    } else {
      addItem({ menuItemId: item.id, name: item.name, unitPriceCents: priceCents, quantity: 1 });
      onAdded(`Added ${item.name} to cart`);
    }
  };

  return (
    <>
      <div className={styles.itemCard}>
        <div className={styles.itemContent}>
          <div className={styles.itemHeader}>
            <h3 className={styles.itemName}>{item.name}</h3>
            <span className={styles.itemPrice}>{formatPrice(priceCents)}</span>
          </div>
          {item.description && <p className={styles.itemDesc}>{item.description}</p>}
          {hasChoices && (
            <span className={styles.itemChoiceHint}>
              {isFamily ? 'Choose 3 entrées' : 'Choose your protein / entrée'}
            </span>
          )}
        </div>
        <button
          className={styles.addBtn}
          onClick={handleAddClick}
          aria-label={`Add ${item.name} to cart`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add
        </button>
      </div>

      {showModal && isFamily && (
        <FamilyMealModal
          item={item}
          onClose={() => setShowModal(false)}
          onAdded={onAdded}
        />
      )}

      {showModal && !isFamily && standardChoices.length > 0 && (
        <StandardModal
          item={item}
          choices={standardChoices}
          onClose={() => setShowModal(false)}
          onAdded={onAdded}
        />
      )}
    </>
  );
}