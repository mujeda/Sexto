
import React, { useState } from 'react';
import { AppState, ShopItem } from '../types';

interface ShopProps {
  role: 'TEACHER' | 'STUDENT';
  state: AppState;
  onUpdateShop?: (items: ShopItem[]) => void;
  onBuyItem?: (item: ShopItem) => void;
  studentId?: string;
}

const Shop: React.FC<ShopProps> = ({ role, state, onUpdateShop, onBuyItem, studentId }) => {
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ShopItem>>({
    name: '',
    description: '',
    price: 100,
    icon: 'star'
  });

  const student = studentId ? state.students.find(s => s.id === studentId) : null;

  const handleSaveItem = () => {
    if (!onUpdateShop) return;
    const itemToSave = editingItem || { ...newItem, id: Math.random().toString() } as ShopItem;
    
    let updatedItems;
    if (editingItem) {
      updatedItems = state.shopItems.map(i => i.id === editingItem.id ? editingItem : i);
    } else {
      updatedItems = [...state.shopItems, itemToSave];
    }
    
    onUpdateShop(updatedItems);
    setEditingItem(null);
    setShowAddModal(false);
    setNewItem({ name: '', description: '', price: 100, icon: 'star' });
  };

  const handleDeleteItem = (id: string) => {
    if (!onUpdateShop) return;
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
      onUpdateShop(state.shopItems.filter(i => i.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="font-comic text-5xl text-comic-yellow tracking-widest text-stroke italic uppercase leading-none">
            {role === 'TEACHER' ? 'GESTIÓN DE TIENDA' : 'TIENDA DE HÉROES'}
          </h2>
          <p className="font-marker text-slate-400 mt-2 uppercase text-xs tracking-widest">
            {role === 'TEACHER' ? 'Configura los poderes y objetos disponibles' : 'Adquiere mejoras con tus Sextos acumulados'}
          </p>
        </div>
        
        {role === 'TEACHER' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-secondary text-white font-comic text-xl comic-border hover:bg-black transition-colors"
          >
            AÑADIR PRODUCTO
          </button>
        )}

        {role === 'STUDENT' && student && (
          <div className="bg-comic-yellow border-4 border-black p-3 rotate-2 shadow-[4px_4px_0px_#000]">
            <p className="font-marker text-[10px] text-black uppercase">Tu Saldo Actual</p>
            <p className="font-comic text-3xl text-black">{student.sextos} SXT</p>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {state.shopItems.map(item => (
          <div key={item.id} className="bg-white comic-card flex flex-col p-5 group relative overflow-hidden">
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              {role === 'TEACHER' && (
                <>
                  <button onClick={() => setEditingItem(item)} className="size-8 bg-comic-yellow border-2 border-black flex items-center justify-center hover:scale-110"><span className="material-symbols-outlined text-sm">edit</span></button>
                  <button onClick={() => handleDeleteItem(item.id)} className="size-8 bg-comic-red border-2 border-black text-white flex items-center justify-center hover:scale-110"><span className="material-symbols-outlined text-sm">delete</span></button>
                </>
              )}
            </div>

            <div className="size-full max-h-40 bg-slate-100 border-4 border-black mb-4 overflow-hidden flex items-center justify-center relative">
              {item.icon.startsWith('http') ? (
                <img src={item.icon} className="w-full h-full object-cover" alt={item.name} />
              ) : (
                <span className="material-symbols-outlined text-6xl text-secondary">{item.icon}</span>
              )}
              <div className="absolute bottom-0 right-0 bg-comic-red text-white font-comic text-2xl px-3 border-l-4 border-t-4 border-black">
                {item.price}
              </div>
            </div>

            <h3 className="font-comic text-2xl text-black uppercase italic leading-none mb-2">{item.name}</h3>
            <p className="font-display text-slate-500 text-xs font-bold flex-1 mb-4">{item.description}</p>
            
            {role === 'STUDENT' && (
              <button 
                onClick={() => onBuyItem?.(item)}
                className={`w-full py-3 font-comic text-xl uppercase italic tracking-widest comic-border transition-all active:scale-95 ${student && student.sextos >= item.price ? 'bg-secondary text-white hover:bg-black' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
              >
                COMPRAR
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => {setShowAddModal(false); setEditingItem(null);}}></div>
          <div className="relative w-full max-w-lg bg-white border-4 border-black p-8 comic-border animate-in zoom-in duration-200">
            <h3 className="font-comic text-4xl text-black italic uppercase text-stroke mb-6">
              {editingItem ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block font-marker text-[10px] text-slate-500 uppercase mb-1">Nombre</label>
                <input 
                  type="text" 
                  className="w-full border-4 border-black p-3 font-bold text-black focus:ring-secondary"
                  value={editingItem ? editingItem.name : newItem.name}
                  onChange={e => editingItem ? setEditingItem({...editingItem, name: e.target.value}) : setNewItem({...newItem, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block font-marker text-[10px] text-slate-500 uppercase mb-1">Descripción</label>
                <textarea 
                  className="w-full border-4 border-black p-3 font-bold text-black focus:ring-secondary h-20"
                  value={editingItem ? editingItem.description : newItem.description}
                  onChange={e => editingItem ? setEditingItem({...editingItem, description: e.target.value}) : setNewItem({...newItem, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-marker text-[10px] text-slate-500 uppercase mb-1">Precio (Sextos)</label>
                  <input 
                    type="number" 
                    className="w-full border-4 border-black p-3 font-bold text-black focus:ring-secondary"
                    value={editingItem ? editingItem.price : newItem.price}
                    onChange={e => editingItem ? setEditingItem({...editingItem, price: Number(e.target.value)}) : setNewItem({...newItem, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block font-marker text-[10px] text-slate-500 uppercase mb-1">Icono o URL Imagen</label>
                  <input 
                    type="text" 
                    placeholder="star, bolt, or http://..."
                    className="w-full border-4 border-black p-3 font-bold text-black focus:ring-secondary"
                    value={editingItem ? editingItem.icon : newItem.icon}
                    onChange={e => editingItem ? setEditingItem({...editingItem, icon: e.target.value}) : setNewItem({...newItem, icon: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => {setShowAddModal(false); setEditingItem(null);}}
                className="flex-1 py-4 bg-slate-200 text-black font-comic text-xl border-4 border-black hover:bg-slate-300"
              >
                CANCELAR
              </button>
              <button 
                onClick={handleSaveItem}
                className="flex-1 py-4 bg-comic-yellow text-black font-comic text-xl border-4 border-black hover:bg-secondary hover:text-white transition-all"
              >
                GUARDAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
