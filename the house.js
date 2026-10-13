/* ---------- SELLER DASHBOARD ---------- */
function SellerDashboard() {
  const st = useStore();
  const [products, setProducts] = useState([]); // This will fetch from your DB
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ n: '', p: 0, fab: '', by: '', img: '' });

  // Security Check: Verify user is logged in and has the 'seller' role
  if (!st.user || st.user.role !== 'seller') {
    return html`<div class="py-24 text-center">Unauthorized. Please log in as a seller.</div>`;
  }

  // Handle Image Upload (Requires Cloud Storage Backend)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Example: const uploadUrl = await uploadToCloudinaryOrS3(file);
    const mockUploadUrl = "https://your-cloud-storage.com/uploaded-image.jpg"; 
    setFormData({ ...formData, img: mockUploadUrl });
  };

  // Handle Save to Database (Requires API Backend)
  const saveProduct = async () => {
    if (editingId) {
      // Example: await fetch(`/api/products/${editingId}`, { method: 'PUT', body: JSON.stringify(formData) });
      setProducts(products.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      // Example: await fetch(`/api/products`, { method: 'POST', body: JSON.stringify(formData) });
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    setEditingId(null);
    setFormData({ n: '', p: 0, fab: '', by: '', img: '' });
  };

  const deleteProduct = async (id) => {
    // Example: await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter(p => p.id !== id));
  };

  const field = 'w-full px-3 py-2.5 border bg-transparent text-sm outline-none mt-1';

  return html`<section class="py-16 md:py-24 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-10">
      <h2 class="serif text-4xl">Seller Dashboard</h2>
      <button onClick=${() => setStore({ user: null })} class="text-xs underline border p-2">Logout</button>
    </div>

    <div class="card p-6 md:p-8 mb-10">
      <h3 class="serif text-2xl mb-4">${editingId ? 'Edit Product' : 'Add New Product'}</h3>
      <div class="grid grid-cols-2 gap-4">
        <label class="text-[11px] tracking-widest uppercase">Name
          <input value=${formData.n} onInput=${e => setFormData({...formData, n: e.target.value})} class=${field}/></label>
        <label class="text-[11px] tracking-widest uppercase">Price (€)
          <input type="number" value=${formData.p} onInput=${e => setFormData({...formData, p: +e.target.value})} class=${field}/></label>
        <label class="text-[11px] tracking-widest uppercase">Fabric Details
          <input value=${formData.fab} onInput=${e => setFormData({...formData, fab: e.target.value})} class=${field}/></label>
        <label class="text-[11px] tracking-widest uppercase">Artisan Name
          <input value=${formData.by} onInput=${e => setFormData({...formData, by: e.target.value})} class=${field}/></label>
      </div>
      
      <div class="mt-4">
        <label class="block text-[11px] tracking-widest uppercase mb-2">Product Image</label>
        <input type="file" accept="image/*" onChange=${handleImageUpload} class="text-sm"/>
        ${formData.img && html`<p class="text-xs mt-2 text-green-600">Image uploaded successfully</p>`}
      </div>

      <div class="mt-6 flex gap-3">
        <button onClick=${saveProduct} class="px-6 py-3 text-xs tracking-widest uppercase" style=${{background:'var(--accent)',color:'#fff'}}>Save Product</button>
        ${editingId && html`<button onClick=${() => setEditingId(null)} class="px-6 py-3 border text-xs tracking-widest uppercase">Cancel</button>`}
      </div>
    </div>

    <h3 class="serif text-2xl mb-4">Current Inventory</h3>
    <div class="space-y-4">
      ${products.map(p => html`<div key=${p.id} class="card p-4 flex justify-between items-center">
        <div>
          <p class="serif text-xl">${p.n} — €${p.p}</p>
          <p class="text-xs" style=${{color:'var(--mute)'}}>${p.fab} · by ${p.by}</p>
        </div>
        <div class="flex gap-3">
          <button onClick=${() => { setEditingId(p.id); setFormData(p); }} class="text-xs underline border p-2">Edit</button>
          <button onClick=${() => deleteProduct(p.id)} class="text-xs underline border p-2" style=${{color:'var(--accent)', borderColor:'var(--accent)'}}>Remove</button>
        </div>
      </div>`)}
    </div>
  </section>`;
}