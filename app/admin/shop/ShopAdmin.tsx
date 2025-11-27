'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type AdminProductImage = {
  id?: string
  url: string
  altText?: string
  sortOrder: number
}

export type AdminProduct = {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  heroImageUrl: string
  price: number
  inventory: number
  isActive: boolean
  isFeatured: boolean
  images: AdminProductImage[]
  updatedAt?: string
}

type ShopAdminResponse = {
  shopEnabled: boolean
  maxFeatured: number
  products: AdminProduct[]
}

const blankNewProduct = {
  name: '',
  price: '',
  inventory: '0',
  description: '',
  longDescription: '',
  heroImageUrl: '',
  isFeatured: false,
}

export default function ShopAdmin() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [shopEnabled, setShopEnabled] = useState(false)
  const [maxFeatured, setMaxFeatured] = useState(3)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [togglingStore, setTogglingStore] = useState(false)
  const [newProduct, setNewProduct] = useState({ ...blankNewProduct })
  const [creating, setCreating] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/products', { cache: 'no-store' })
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/login'
        return
      }
      const data: ShopAdminResponse = await res.json()
      setProducts(data.products || [])
      setShopEnabled(Boolean(data.shopEnabled))
      setMaxFeatured(data.maxFeatured || 3)
      setErr(null)
    } catch (error) {
      console.error(error)
      setErr('Failed to load products. Please refresh.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const featuredCount = useMemo(
    () => products.filter((product) => product.isFeatured).length,
    [products],
  )

  const setStatusMessage = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 4000)
  }

  const handleStoreToggle = async () => {
    try {
      setTogglingStore(true)
      const res = await fetch('/api/admin/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'shop_enabled', enabled: !shopEnabled }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Toggle failed')
      }

      setShopEnabled((prev) => !prev)
      setStatusMessage(`Store is now ${!shopEnabled ? 'online' : 'offline'}.`)
    } catch (error: any) {
      setErr(error.message || 'Failed to toggle store')
    } finally {
      setTogglingStore(false)
    }
  }

  const handleCreateProduct = async () => {
    if (!newProduct.name.trim()) {
      setErr('Product name is required.')
      return
    }

    try {
      setCreating(true)
      const payload = {
        name: newProduct.name,
        description: newProduct.description || undefined,
        longDescription: newProduct.longDescription || undefined,
        heroImageUrl: newProduct.heroImageUrl || undefined,
        price: parseFloat(newProduct.price || '0'),
        inventory: parseInt(newProduct.inventory || '0', 10) || 0,
        isFeatured: newProduct.isFeatured,
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create product')
      }

      setNewProduct({ ...blankNewProduct })
      setStatusMessage('Product created. Add details below.')
      await fetchData()
    } catch (error: any) {
      setErr(error.message || 'Failed to create product')
    } finally {
      setCreating(false)
    }
  }

  const handleSaveProduct = async (productId: string, draft: Partial<AdminProduct> & { price: number; inventory: number; images?: AdminProductImage[] }) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save product')
      }

      setStatusMessage('Product updated.')
      await fetchData()
    } catch (error: any) {
      setErr(error.message || 'Failed to save product')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Delete this product? This action cannot be undone.')) return

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete product')
      }
      setStatusMessage('Product deleted.')
      await fetchData()
    } catch (error: any) {
      setErr(error.message || 'Failed to delete product')
    }
  }

  const handleImageUpload = async (_productId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/content/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Upload failed')
    }

    const payload = await res.json()
    return payload.path as string
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F8F8F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading shop manager…
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/admin" style={{ color: '#B8B8B8', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          ← Back to Dashboard
        </Link>

        <header style={{ marginBottom: '2.5rem' }}>
          <p style={{ textTransform: 'uppercase', letterSpacing: '4px', color: '#B8B8B8', fontSize: '0.85rem' }}>Commerce</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.75rem', color: '#F8F8F8', marginBottom: '0.75rem' }}>
            Shop Management
          </h1>
          <p style={{ color: '#B8B8B8', maxWidth: '720px', lineHeight: 1.5 }}>
            Curate the storefront, highlight hero products, and keep inventory, descriptions, and imagery aligned with the brand experience.
          </p>
        </header>

        {(err || message) && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1rem 1.25rem',
              border: `1px solid ${err ? '#FCA5A5' : 'rgba(201, 168, 106, 0.4)'}`,
              color: err ? '#FCA5A5' : '#C9A86A',
              backgroundColor: err ? 'rgba(248, 113, 113, 0.08)' : 'rgba(201, 168, 106, 0.08)',
            }}
          >
            {err || message}
          </div>
        )}

        {/* Store toggle */}
        <section
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(201, 168, 106, 0.3)',
            padding: '1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#F8F8F8', fontSize: '1.5rem', marginBottom: '0.25rem' }}>
              Storefront Status
            </h2>
            <p style={{ color: '#B8B8B8' }}>
              {shopEnabled
                ? 'Customers can browse and add products to their cart. Checkout reminders guide them back to WhatsApp to advise payment.'
                : 'The shop is offline. Visitors will see a coming-soon message with a WhatsApp contact shortcut.'}
            </p>
            <p style={{ color: '#B8B8B8', marginTop: '0.5rem', fontSize: '0.875rem' }}>
              Featured slots in use: {featuredCount}/{maxFeatured}
            </p>
          </div>
          <button
            onClick={handleStoreToggle}
            disabled={togglingStore}
            style={{
              minWidth: '200px',
              padding: '0.85rem 1.5rem',
              borderRadius: '999px',
              border: '1px solid rgba(201, 168, 106, 0.6)',
              backgroundColor: shopEnabled ? '#C9A86A' : 'transparent',
              color: shopEnabled ? '#0A0A0A' : '#C9A86A',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: togglingStore ? 0.6 : 1,
            }}
          >
            {togglingStore ? 'Updating…' : shopEnabled ? 'Turn Store Off' : 'Go Live'}
          </button>
        </section>

        {/* Create new product */}
        <section
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(201, 168, 106, 0.3)',
            padding: '1.75rem',
            marginBottom: '2.5rem',
          }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#F8F8F8', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Add a Product
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <InputField label="Name" value={newProduct.name} onChange={(value) => setNewProduct((prev) => ({ ...prev, name: value }))} />
            <InputField label="Price (MYR)" value={newProduct.price} onChange={(value) => setNewProduct((prev) => ({ ...prev, price: value }))} />
            <InputField
              label="Inventory"
              value={newProduct.inventory}
              onChange={(value) => setNewProduct((prev) => ({ ...prev, inventory: value }))}
            />
            <InputField
              label="Hero Image URL"
              value={newProduct.heroImageUrl}
              onChange={(value) => setNewProduct((prev) => ({ ...prev, heroImageUrl: value }))}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <TextareaField
              label="Short Description"
              value={newProduct.description}
              rows={3}
              onChange={(value) => setNewProduct((prev) => ({ ...prev, description: value }))}
            />
            <TextareaField
              label="Long Description"
              value={newProduct.longDescription}
              rows={3}
              onChange={(value) => setNewProduct((prev) => ({ ...prev, longDescription: value }))}
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B8B8B8', marginTop: '1rem' }}>
            <input
              type="checkbox"
              checked={newProduct.isFeatured}
              onChange={(event) => setNewProduct((prev) => ({ ...prev, isFeatured: event.target.checked }))}
            />
            Feature this product in the hero carousel (max {maxFeatured})
          </label>
          <button
            onClick={handleCreateProduct}
            disabled={creating}
            style={{
              marginTop: '1.5rem',
              padding: '0.85rem 1.75rem',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#C9A86A',
              color: '#0A0A0A',
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: '200px',
            }}
          >
            {creating ? 'Creating…' : 'Create Product'}
          </button>
        </section>

        {/* Existing products */}
        <section>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#F8F8F8', fontSize: '2rem' }}>
              Product Catalog ({products.length})
            </h2>
            <p style={{ color: '#B8B8B8' }}>
              Click into a card to edit pricing, inventory, descriptions, and gallery assets. Toggle availability or feature placement anytime.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
            {products.map((product) => (
              <ProductEditorCard
                key={product.id}
                product={product}
                onSave={(draft) => handleSaveProduct(product.id, draft)}
                onDelete={() => handleDeleteProduct(product.id)}
                onUploadImage={(file) => handleImageUpload(product.id, file)}
                maxFeatured={maxFeatured}
                featuredCount={featuredCount}
              />
            ))}
            {products.length === 0 && (
              <div
                style={{
                  border: '1px dashed rgba(201, 168, 106, 0.4)',
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#B8B8B8',
                }}
              >
                No products yet. Add one using the form above to get started.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

// Reusable inputs
const labelStyle: React.CSSProperties = {
  color: '#B8B8B8',
  fontSize: '0.875rem',
  marginBottom: '0.35rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(201, 168, 106, 0.25)',
  color: '#F8F8F8',
  borderRadius: '6px',
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={labelStyle}>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={inputStyle}
      />
    </label>
  )
}

function TextareaField({
  label,
  value,
  rows = 3,
  onChange,
}: {
  label: string
  value: string
  rows?: number
  onChange: (value: string) => void
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={labelStyle}>{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        style={{ ...inputStyle, resize: 'vertical' }}
      />
    </label>
  )
}

type ProductEditorCardProps = {
  product: AdminProduct
  onSave: (draft: { name: string; slug: string; description: string; longDescription: string; heroImageUrl: string; price: number; inventory: number; isActive: boolean; isFeatured: boolean; images: AdminProductImage[] }) => Promise<void> | void
  onDelete: () => Promise<void> | void
  onUploadImage: (file: File) => Promise<string>
  maxFeatured: number
  featuredCount: number
}

function ProductEditorCard({ product, onSave, onDelete, onUploadImage, maxFeatured, featuredCount }: ProductEditorCardProps) {
  const [name, setName] = useState(product.name)
  const [slug, setSlug] = useState(product.slug)
  const [description, setDescription] = useState(product.description || '')
  const [longDescription, setLongDescription] = useState(product.longDescription || '')
  const [heroImageUrl, setHeroImageUrl] = useState(product.heroImageUrl || '')
  const [priceInput, setPriceInput] = useState(product.price.toFixed(2))
  const [inventoryInput, setInventoryInput] = useState(product.inventory.toString())
  const [isActive, setIsActive] = useState(product.isActive)
  const [isFeatured, setIsFeatured] = useState(product.isFeatured)
  const [images, setImages] = useState<AdminProductImage[]>(product.images || [])
  const [saving, setSaving] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  useEffect(() => {
    setName(product.name)
    setSlug(product.slug)
    setDescription(product.description || '')
    setLongDescription(product.longDescription || '')
    setHeroImageUrl(product.heroImageUrl || '')
    setPriceInput(product.price.toFixed(2))
    setInventoryInput(product.inventory.toString())
    setIsActive(product.isActive)
    setIsFeatured(product.isFeatured)
    setImages(product.images || [])
  }, [product])

  const handleSave = async () => {
    const draft = {
      name,
      slug,
      description,
      longDescription,
      heroImageUrl,
      price: parseFloat(priceInput || '0'),
      inventory: parseInt(inventoryInput || '0', 10) || 0,
      isActive,
      isFeatured,
      images: images.map((image, index) => ({
        ...image,
        sortOrder: image.sortOrder ?? index,
      })),
    }

    try {
      setSaving(true)
      await onSave(draft)
    } finally {
      setSaving(false)
    }
  }

  const handleAddImage = () => {
    setImages((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        url: '',
        altText: '',
        sortOrder: prev.length,
      },
    ])
  }

  const handleImageChange = (index: number, key: keyof AdminProductImage, value: string) => {
    setImages((prev) => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        [key]: key === 'sortOrder' ? Number(value) : value,
      }
      return next
    })
  }

  const handleImageUploadLocal = async (index: number, file?: File) => {
    if (!file) return
    try {
      setUploadingIndex(index)
      const url = await onUploadImage(file)
      handleImageChange(index, 'url', url)
    } catch (error) {
      alert((error as Error).message || 'Upload failed')
    } finally {
      setUploadingIndex(null)
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index))
  }

  return (
    <div
      style={{
        border: '1px solid rgba(201, 168, 106, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        padding: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#F8F8F8' }}>{product.name}</h3>
          <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>Slug: {product.slug}</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <Badge active={isActive} label={isActive ? 'Active' : 'Hidden'} />
            <Badge active={isFeatured} label={isFeatured ? 'Featured' : 'Standard'} />
            <Badge active={product.inventory > 0} label={`Inventory: ${inventoryInput}`} />
          </div>
        </div>
        {heroImageUrl && (
          <div style={{ width: '180px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(201, 168, 106, 0.3)' }}>
            <img
              src={heroImageUrl}
              alt={`${name} hero`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <InputField label="Name" value={name} onChange={setName} />
        <InputField label="Slug" value={slug} onChange={setSlug} />
        <InputField label="Price (MYR)" value={priceInput} onChange={setPriceInput} />
        <InputField label="Inventory" value={inventoryInput} onChange={setInventoryInput} />
        <InputField label="Hero Image" value={heroImageUrl} onChange={setHeroImageUrl} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <TextareaField label="Short Description" value={description} onChange={setDescription} />
        <TextareaField label="Long Description" value={longDescription} onChange={setLongDescription} />
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B8B8B8' }}>
          <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
          Product is active and visible
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B8B8B8' }}>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) => setIsFeatured(event.target.checked)}
            disabled={!isFeatured && featuredCount >= maxFeatured}
          />
          Featured (max {maxFeatured})
        </label>
      </div>

      {/* Images */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#F8F8F8' }}>Gallery</h4>
          <button
            onClick={handleAddImage}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '4px',
              border: '1px solid rgba(201, 168, 106, 0.4)',
              backgroundColor: 'transparent',
              color: '#C9A86A',
              cursor: 'pointer',
            }}
          >
            + Add Image
          </button>
        </div>

        {images.length === 0 && <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>No images yet.</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {images.map((image, index) => (
            <div
              key={image.id || index}
              style={{
                border: '1px solid rgba(201, 168, 106, 0.2)',
                padding: '1rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <InputField label="Image URL" value={image.url} onChange={(value) => handleImageChange(index, 'url', value)} />
                <InputField label="Alt Text" value={image.altText || ''} onChange={(value) => handleImageChange(index, 'altText', value)} />
                <InputField
                  label="Sort Order"
                  value={(image.sortOrder ?? index).toString()}
                  onChange={(value) => handleImageChange(index, 'sortOrder', value)}
                />
              </div>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageUploadLocal(index, event.target.files?.[0])}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span>{uploadingIndex === index ? 'Uploading…' : 'Upload image'}</span>
                </label>
                <button
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(248, 113, 113, 0.4)',
                    color: '#FCA5A5',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '0.85rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#C9A86A',
            color: '#0A0A0A',
            fontWeight: 600,
            cursor: 'pointer',
            minWidth: '160px',
          }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: '0.85rem 1.5rem',
            borderRadius: '6px',
            border: '1px solid rgba(248, 113, 113, 0.4)',
            backgroundColor: 'transparent',
            color: '#FCA5A5',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function Badge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      style={{
        padding: '0.2rem 0.75rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        border: `1px solid ${active ? 'rgba(201, 168, 106, 0.6)' : 'rgba(255, 255, 255, 0.2)'}`,
        color: active ? '#C9A86A' : '#B8B8B8',
      }}
    >
      {label}
    </span>
  )
}


