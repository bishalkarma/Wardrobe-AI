"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { Check, Heart, ImagePlus, Pencil, Plus, Search, Shirt, SlidersHorizontal, Trash2, X } from "lucide-react";
import { usePrototype } from "@/components/prototype-provider";
import { Modal, PageHeading } from "@/components/ui";
import { CATEGORIES, CATEGORY_IMAGE } from "@/lib/mock-data";
import type { ClothingCategory, WardrobeItem } from "@/lib/types";

function WardrobeCard({ item, onOpen, onFavorite }: { item: WardrobeItem; onOpen: () => void; onFavorite: () => void }) {
  return (
    <article className="item-card">
      <button className="item-card-image" type="button" onClick={onOpen} aria-label={`View ${item.name}`}>
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 680px) 48vw, (max-width: 1100px) 30vw, 260px" className="cover-image" />
        <span className="item-category-tag">{item.category}</span>
      </button>
      <button className={`item-favorite${item.favorite ? " is-favorite" : ""}`} type="button" onClick={onFavorite} aria-label={item.favorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`} aria-pressed={item.favorite}>
        <Heart size={17} fill={item.favorite ? "currentColor" : "none"} strokeWidth={1.7} />
      </button>
      <button className="item-card-copy" type="button" onClick={onOpen}>
        <span className="item-card-name">{item.name}</span>
        <span className="item-card-detail">{item.color} <i /> {item.subcategory}</span>
      </button>
    </article>
  );
}

export function WardrobeScreen() {
  const { items, addItem, updateItem, deleteItem, toggleItemFavorite, notify } = usePrototype();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<WardrobeItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const text = `${item.name} ${item.category} ${item.color} ${item.subcategory}`.toLowerCase();
    return matchesCategory && text.includes(query.trim().toLowerCase());
  }), [items, category, query]);

  function closeDetails() {
    setSelected(null);
    setEditMode(false);
    setDeleteConfirm(false);
  }

  return (
    <div className="page-stack wardrobe-screen">
      <PageHeading
        eyebrow="THE PIECES THAT FEEL LIKE YOU"
        title="Your wardrobe"
        subtitle={`${items.length} pieces, all in one thoughtful place.`}
        action={<button className="button button-dark" type="button" onClick={() => setAddOpen(true)}><Plus size={17} /> Add a piece</button>}
      />

      <div className="wardrobe-toolbar">
        <label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your wardrobe" aria-label="Search your wardrobe" />{query && <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}</label>
        <button type="button" className="filter-button" onClick={() => notify("More filters are coming later.")}><SlidersHorizontal size={16} /><span>Filters</span></button>
      </div>

      <div className="category-scroller" role="tablist" aria-label="Filter wardrobe by category">
        {CATEGORIES.map((value) => {
          const count = value === "All" ? items.length : items.filter((item) => item.category === value).length;
          return <button key={value} role="tab" type="button" aria-selected={category === value} className={`category-chip${category === value ? " is-selected" : ""}`} onClick={() => setCategory(value)}>{value}<span>{count}</span></button>;
        })}
      </div>

      {filteredItems.length ? (
        <div className="wardrobe-grid">
          {filteredItems.map((item) => <WardrobeCard key={item.id} item={item} onOpen={() => { setSelected(item); setEditMode(false); }} onFavorite={() => toggleItemFavorite(item.id)} />)}
          <button className="add-item-card" type="button" onClick={() => setAddOpen(true)}>
            <span className="add-item-mark"><Plus size={21} /></span><strong>Make room for one more</strong><span>Add something you love.</span>
          </button>
        </div>
      ) : (
        <div className="empty-state"><span className="empty-state-icon"><Shirt size={23} /></span><h2>No pieces found</h2><p>Try a different search or category, or add something new.</p><button type="button" className="button button-outline" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>
      )}

      <div className="wardrobe-note"><span className="note-check"><Check size={14} /></span><span>AI suggestions are just a starting point. You’re always in control of what a piece is called.</span></div>

      <Modal open={Boolean(selected) && !editMode} onClose={closeDetails} title={selected?.name ?? "Clothing details"} size="wide">
        {selected && (
          <div className="item-detail-layout">
            <div className="item-detail-photo"><Image src={selected.image} alt={selected.name} fill sizes="(max-width: 720px) 100vw, 340px" className="cover-image" /></div>
            <div className="item-detail-info">
              <div className="detail-topline"><span className="item-category-tag static-tag">{selected.category}</span><span className="detail-added">{selected.addedAt}</span></div>
              <p className="detail-subcategory">{selected.subcategory}</p>
              <div className="detail-meta-grid"><span><small>Color</small><strong>{selected.color}</strong></span><span><small>Pattern</small><strong>{selected.pattern}</strong></span><span><small>Material</small><strong>{selected.material}</strong></span><span><small>Formality</small><strong>{selected.formality}</strong></span></div>
              {selected.brand && <p className="detail-brand">Brand <strong>{selected.brand}</strong></p>}
              <div className="detail-occasion-row"><small>Works for</small><div>{selected.occasions.map((occasion) => <span className="mini-chip" key={occasion}>{occasion}</span>)}</div></div>
              {selected.notes && <p className="detail-note">“{selected.notes}”</p>}
              <p className="ai-suggestion-note"><span className="ai-suggestion-dot" /> Metadata is editable. This sample was reviewed by its owner.</p>
              <div className="detail-actions"><button className="button button-dark" type="button" onClick={() => setEditMode(true)}><Pencil size={15} /> Edit details</button><button className="button button-quiet danger-text" type="button" onClick={() => setDeleteConfirm(true)}><Trash2 size={15} /> Delete</button></div>
              {deleteConfirm && <div className="delete-confirm"><span><strong>Remove this piece?</strong><small>This only changes the local demo wardrobe.</small></span><div><button type="button" className="button button-quiet" onClick={() => setDeleteConfirm(false)}>Keep it</button><button type="button" className="button button-danger" onClick={() => { deleteItem(selected.id); closeDetails(); }}>Remove</button></div></div>}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={editMode && Boolean(selected)} onClose={() => setEditMode(false)} title="Edit clothing details">
        {selected && <EditItemForm item={selected} onCancel={() => setEditMode(false)} onSave={(patch) => { updateItem(selected.id, patch); setSelected({ ...selected, ...patch }); setEditMode(false); }} />}
      </Modal>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add something you love" size="wide">
        <AddItemForm onCancel={() => setAddOpen(false)} onSave={(item) => { addItem(item); setAddOpen(false); }} notify={notify} />
      </Modal>
    </div>
  );
}

function EditItemForm({ item, onCancel, onSave }: { item: WardrobeItem; onCancel: () => void; onSave: (patch: Partial<WardrobeItem>) => void }) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<ClothingCategory>(item.category);
  const [color, setColor] = useState(item.color);
  const [material, setMaterial] = useState(item.material);
  const [notes, setNotes] = useState(item.notes ?? "");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ name, category, color, material, notes });
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="field-label">Item name<input className="text-input" value={name} onChange={(event) => setName(event.target.value)} required /></label>
      <div className="form-row"><label className="field-label">Category<select className="text-input" value={category} onChange={(event) => setCategory(event.target.value as ClothingCategory)}>{CATEGORIES.filter((value) => value !== "All").map((value) => <option key={value}>{value}</option>)}</select></label><label className="field-label">Color<input className="text-input" value={color} onChange={(event) => setColor(event.target.value)} /></label></div>
      <label className="field-label">Material<input className="text-input" value={material} onChange={(event) => setMaterial(event.target.value)} /></label>
      <label className="field-label">Your notes<textarea className="text-input text-area" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Anything you want to remember about it?" rows={3} /></label>
      <div className="modal-action-row"><button className="button button-light" type="button" onClick={onCancel}>Cancel</button><button className="button button-dark" type="submit"><Check size={15} /> Save changes</button></div>
    </form>
  );
}

function AddItemForm({ onCancel, onSave, notify }: { onCancel: () => void; onSave: (item: Omit<WardrobeItem, "id" | "favorite" | "addedAt">) => void; notify: (message: string) => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("Tops");
  const [color, setColor] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      name,
      category,
      subcategory: category === "Tops" ? "Everyday top" : category === "Bottoms" ? "Everyday bottom" : category === "Shoes" ? "Footwear" : category === "Accessories" ? "Accessory" : "Outerwear",
      color: color || "Not set",
      pattern: "Not set",
      material: "Not set",
      season: ["All season"],
      formality: "Casual",
      occasions: ["Everyday"],
      notes: "Added as a local prototype item.",
      image: CATEGORY_IMAGE[category],
    });
  }

  return (
    <form className="add-item-form" onSubmit={submit}>
      <div className="mock-upload-panel">
        <div className="mock-upload-icon"><ImagePlus size={21} /></div>
        <div><strong>Add a photo of your piece</strong><p>Keep the original. We’ll never silently replace it.</p></div>
        <div className="mock-upload-actions"><button type="button" className="button button-light button-small" onClick={() => notify("Camera access is not connected in this prototype.")}>Take a photo</button><button type="button" className="button button-light button-small" onClick={() => notify("Gallery upload is not connected in this prototype.")}>Choose image</button></div>
        <span className="mock-upload-tag">PHOTO UPLOAD · DEMO ONLY</span>
      </div>
      <div className="form-row"><label className="field-label">What is it called?<input className="text-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. The Sunday shirt" required /></label><label className="field-label">Category<select className="text-input" value={category} onChange={(event) => setCategory(event.target.value as ClothingCategory)}>{CATEGORIES.filter((value) => value !== "All").map((value) => <option key={value}>{value}</option>)}</select></label></div>
      <label className="field-label">Main color<input className="text-input" value={color} onChange={(event) => setColor(event.target.value)} placeholder="e.g. Soft blue" /></label>
      <p className="prototype-disclaimer">This adds a sample entry to this browser session only. No image is uploaded or saved.</p>
      <div className="modal-action-row"><button className="button button-light" type="button" onClick={onCancel}>Cancel</button><button className="button button-dark" type="submit"><Plus size={16} /> Add to wardrobe</button></div>
    </form>
  );
}
