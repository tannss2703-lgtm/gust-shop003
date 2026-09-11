'use client';

import Link from 'next/link';
import { useState } from 'react';

// ข้อมูลจำลองสำหรับหมวดหมู่สินค้า
const categories = [
  { id: 1, name: 'สินค้าทั้งหมด', icon: '✨' },
  { id: 2, name: 'เสื้อผ้าแฟชั่น', icon: '🧶' },
  { id: 3, name: 'อุปกรณ์ไอที', icon: '🎧' },
  { id: 4, name: 'ของใช้ในบ้าน', icon: '🕯️' },
];

// ข้อมูลจำลองสำหรับสินค้าและสต็อกคงเหลือ
const initialProducts = [
  {
    id: 1,
    name: 'เสื้อกันหนาว Minimal Style',
    price: 590,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80',
    category: 'เสื้อผ้าแฟชั่น',
  },
  {
    id: 2,
    name: 'หูฟังไร้สาย Noise Cancelling',
    price: 1290,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    category: 'อุปกรณ์ไอที',
  },
  {
    id: 3,
    name: 'แก้วเก็บความเย็น 30 oz',
    price: 350,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=80',
    category: 'ของใช้ในบ้าน',
  },
  {
    id: 4,
    name: 'กระเป๋าผ้า Canvas อเนกประสงค์',
    price: 220,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80',
    category: 'เสื้อผ้าแฟชั่น',
  },
];

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface StockLog {
  id: number;
  date: string;
  productName: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  note: string;
}

interface PurchasedItem extends CartItem {
  purchasedAt: string;
}

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // ระบบสินค้าและสต็อก
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // สถานะเก็บรายการสินค้าที่ถูกตัดสต็อก (สั่งซื้อสำเร็จแล้ว)
  const [recentPurchases, setRecentPurchases] = useState<PurchasedItem[]>([]);

  // สถานะสำหรับระบบบัญชีสินค้า (Stock Ledger Modal)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([
    { id: 1, date: new Date().toLocaleString(), productName: 'เสื้อกันหนาว Minimal Style', type: 'IN', quantity: 15, note: 'รับสินค้าเข้าล็อตแรก' },
    { id: 2, date: new Date().toLocaleString(), productName: 'หูฟังไร้สาย Noise Cancelling', type: 'IN', quantity: 8, note: 'รับสินค้าเข้าล็อตแรก' },
    { id: 3, date: new Date().toLocaleString(), productName: 'แก้วเก็บความเย็น 30 oz', type: 'IN', quantity: 25, note: 'รับสินค้าเข้าล็อตแรก' },
    { id: 4, date: new Date().toLocaleString(), productName: 'กระเป๋าผ้า Canvas อเนกประสงค์', type: 'IN', quantity: 12, note: 'รับสินค้าเข้าล็อตแรก' },
  ]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'สวัสดีค่ะ! ยินดีต้อนรับสู่ kruklaapp มีสินค้าชิ้นไหนให้ช่วยแนะนำไหมคะ? 😊' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // ฟังก์ชันเพิ่มสินค้าลงตะกร้า (พร้อมเปิด Modal ตะกร้าทันที)
  const addToCart = (product: typeof products[0]) => {
    const existingInCart = cart.find((item) => item.id === product.id);
    const currentQtyInCart = existingInCart ? existingInCart.quantity : 0;

    if (currentQtyInCart + 1 > product.stock) {
      alert('สินค้าในสต็อกมีไม่เพียงพอค่ะ');
      return;
    }

    setCart((prevCart) => {
      if (existingInCart) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    const targetProduct = products.find((p) => p.id === id);
    const targetCartItem = cart.find((item) => item.id === id);

    if (delta > 0 && targetProduct && targetCartItem) {
      if (targetCartItem.quantity + 1 > targetProduct.stock) {
        alert('สินค้าในสต็อกหมดแล้วค่ะ');
        return;
      }
    }

    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ดำเนินการสั่งซื้อ (ตัดสต็อกสินค้า และบันทึกลงบัญชีสินค้า พร้อมนำรูปและข้อมูลมาแสดงในส่วนล่าสุด)
  const handleCheckout = () => {
    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find((item) => item.id === prod.id);
      if (cartItem) {
        return { ...prod, stock: prod.stock - cartItem.quantity };
      }
      return prod;
    });

    const newLogs: StockLog[] = cart.map((item, index) => ({
      id: Date.now() + index,
      date: new Date().toLocaleString(),
      productName: item.name,
      type: 'OUT',
      quantity: item.quantity,
      note: `ขายให้ลูกค้า: ${currentUser || 'Guest'}`,
    }));

    const purchasedTimestamp = new Date().toLocaleString();
    const newPurchases: PurchasedItem[] = cart.map((item) => ({
      ...item,
      purchasedAt: purchasedTimestamp,
    }));

    setProducts(updatedProducts);
    setStockLogs((prev) => [...newLogs, ...prev]);
    setRecentPurchases((prev) => [...newPurchases, ...prev]);

    alert('สั่งซื้อสินค้าเรียบร้อยแล้ว! ระบบได้ทำการตัดสต็อกและอัปเดตรายการล่าสุดให้แล้วค่ะ');
    setCart([]);
    setIsCartOpen(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setCurrentUser(name);
    setAuthModal(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setCurrentUser(email.split('@')[0]);
    setAuthModal(null);
    setEmail('');
    setPassword('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    setTimeout(() => {
      let botReply = 'ขอบคุณสำหรับข้อความค่ะ เจ้าหน้าที่แอดมินจะรีบตรวจสอบและติดต่อกลับโดยเร็วที่สุดค่ะ';
      const lowerText = userText.toLowerCase();
      if (lowerText.includes('ส่ง') || lowerText.includes('ค่าส่ง')) {
        botReply = 'ทางเราจัดส่งสินค้าทั่วประเทศ ค่าจัดส่งเริ่มต้นเพียง 30 บาท ส่งไวภายใน 1-3 วันค่ะ 📦';
      } else if (lowerText.includes('สต็อก') || lowerText.includes('สินค้า')) {
        botReply = 'สามารถดูสินค้าและสถานะสต็อกคงเหลือได้จากหน้าแรกเลยนะคะ ระบบอัปเดตแบบเรียลไทม์ค่ะ 📊';
      }
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-800 font-sans selection:bg-neutral-200">
      {/* Navbar (Minimalist Clean Style) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight text-neutral-900">
            krukla<span className="text-neutral-400 font-light">app</span>
          </Link>
          <nav className="hidden md:flex space-x-8 items-center text-sm font-medium text-neutral-600">
            <Link href="/" className="hover:text-neutral-950 transition">หน้าแรก</Link>
            <Link href="#products" className="hover:text-neutral-950 transition">เลือกสินค้า</Link>
            <button
              onClick={() => setIsStockModalOpen(true)}
              className="hover:text-neutral-950 transition cursor-pointer flex items-center gap-1.5"
            >
              <span className="text-base">📊</span> บัญชีสต็อกสินค้า
            </button>
          </nav>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-neutral-700 hover:text-neutral-950 transition rounded-full hover:bg-neutral-100 cursor-pointer"
              title="ดูตะกร้าสินค้า"
            >
              <span className="text-xl">🛒</span>
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 bg-neutral-900 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
                  {totalCartItems}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-3 pl-2">
                <span className="text-xs font-medium text-neutral-600 hidden sm:inline bg-neutral-100 px-3 py-1.5 rounded-full">
                  👤 {currentUser}
                </span>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setAuthModal('register');
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-800 transition cursor-pointer"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAuthModal('login')}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-950 px-3 py-2 transition cursor-pointer"
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  onClick={() => setAuthModal('register')}
                  className="text-xs font-medium bg-neutral-900 text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition cursor-pointer shadow-sm"
                >
                  สมัครสมาชิก
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-4 bg-neutral-100 px-3 py-1 rounded-full">
          New Collection 2026
        </span>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-neutral-900 mb-6 leading-tight">
          Gust Shop
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto mb-10 text-sm sm:text-base font-light leading-relaxed">
          คัดสรรสินค้าคุณภาพดีไซน์มินิมอล พร้อมระบบจัดการคำสั่งซื้อและสต็อกมาตรฐานโปร่งใส
        </p>
        <div className="flex justify-center items-center gap-4">
          <a
            href="#products"
            className="bg-neutral-900 text-white text-sm font-medium px-7 py-3 rounded-full hover:bg-neutral-800 transition shadow-sm inline-block"
          >
            สำรวจสินค้า
          </a>
          <button
            onClick={() => setIsStockModalOpen(true)}
            className="border border-neutral-200 text-neutral-700 text-sm font-medium px-6 py-3 rounded-full hover:border-neutral-400 transition bg-white cursor-pointer"
          >
            ดูบัญชีสต็อก
          </button>
        </div>
      </section>

      {/* Categories (Clean Card Grid) */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white p-6 rounded-2xl border border-neutral-100 hover:border-neutral-300 transition duration-300 cursor-pointer flex flex-col items-center text-center group"
            >
              <span className="text-3xl mb-3 group-hover:scale-110 transition duration-300">{cat.icon}</span>
              <span className="text-sm font-medium text-neutral-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products (Minimalist Product Cards) */}
      <section id="products" className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-light tracking-tight text-neutral-900">สินค้าแนะนำ</h2>
            <p className="text-xs text-neutral-400 mt-1">รายการสินค้าพร้อมส่ง อัปเดตสต็อกเรียลไทม์</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-xl hover:shadow-neutral-100 transition duration-500 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 w-full bg-neutral-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                  />
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-md ${
                    product.stock > 0 ? 'bg-white/80 text-neutral-800 shadow-xs' : 'bg-neutral-900/80 text-white'
                  }`}>
                    {product.stock > 0 ? `เหลือ ${product.stock} ชิ้น` : 'สินค้าหมด'}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-[11px] text-neutral-400 font-light uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="font-normal text-neutral-800 text-sm mt-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-neutral-900 font-semibold text-base mt-2">
                    ฿{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    product.stock > 0 
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-xs' 
                      : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'เพิ่มลงตะกร้า' : 'สินค้าหมด'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Purchases Section (รายการสั่งซื้อล่าสุด) */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-neutral-100">
        <div className="mb-8">
          <h2 className="text-2xl font-light tracking-tight text-neutral-900">รายการสั่งซื้อล่าสุด</h2>
          <p className="text-xs text-neutral-400 mt-1">รูปและข้อมูลสินค้าที่ทำรายการตัดสต็อกสำเร็จ</p>
        </div>
        
        {recentPurchases.length === 0 ? (
          <div className="bg-white border border-dashed border-neutral-200 rounded-2xl p-12 text-center text-neutral-400 text-sm">
            <span className="text-3xl block mb-2 opacity-50">📦</span>
            <p className="font-light">ยังไม่มีรายการสั่งซื้อหรือตัดสต็อกสินค้าในขณะนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentPurchases.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-100 p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-neutral-100 rounded-xl overflow-hidden mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-neutral-900/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full text-[10px] font-medium">
                      ซื้อแล้ว ({item.quantity} ชิ้น)
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block mb-1">เวลา: {item.purchasedAt}</span>
                  <h3 className="font-medium text-neutral-800 text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-neutral-900 font-semibold text-sm mt-1">
                    ฿{(item.price * item.quantity).toLocaleString()} 
                    <span className="text-[11px] text-neutral-400 font-light ml-1">(฿{item.price.toLocaleString()} / ชิ้น)</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-100 py-10 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-neutral-400 text-xs font-light">
          &copy; {new Date().getFullYear()} kruklaapp. Minimalist E-Commerce Experience.
        </div>
      </footer>

      {/* ================= STOCK LEDGER MODAL ================= */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-neutral-100">
            <div className="bg-white px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">📊 ระบบบัญชีและสต็อกสินค้า (Stock Ledger)</h2>
              <button
                onClick={() => setIsStockModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              <div>
                <h3 className="font-medium text-neutral-800 mb-3 text-sm">สถานะสินค้าคงเหลือปัจจุบัน</h3>
                <div className="overflow-x-auto border border-neutral-100 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-100">
                      <tr>
                        <th className="p-3.5">รหัสสินค้า</th>
                        <th className="p-3.5">ชื่อสินค้า</th>
                        <th className="p-3.5">หมวดหมู่</th>
                        <th className="p-3.5 text-right">ราคา</th>
                        <th className="p-3.5 text-right">คงเหลือ (ชิ้น)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-700">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50/50">
                          <td className="p-3.5 text-neutral-400">#{p.id}</td>
                          <td className="p-3.5 font-medium text-neutral-900">{p.name}</td>
                          <td className="p-3.5 text-neutral-500">{p.category}</td>
                          <td className="p-3.5 text-right">฿{p.price.toLocaleString()}</td>
                          <td className={`p-3.5 text-right font-semibold ${p.stock > 5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {p.stock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-neutral-800 mb-3 text-sm">ประวัติความเคลื่อนไหว (Stock Movement Ledger)</h3>
                <div className="overflow-x-auto border border-neutral-100 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-100">
                      <tr>
                        <th className="p-3.5">วัน-เวลา</th>
                        <th className="p-3.5">รายการสินค้า</th>
                        <th className="p-3.5 text-center">ประเภท</th>
                        <th className="p-3.5 text-right">จำนวน</th>
                        <th className="p-3.5">หมายเหตุ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-700">
                      {stockLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-neutral-50/50">
                          <td className="p-3.5 text-neutral-400 text-[11px]">{log.date}</td>
                          <td className="p-3.5 font-medium text-neutral-900">{log.productName}</td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              log.type === 'IN' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {log.type === 'IN' ? 'รับเข้า (IN)' : 'จ่ายออก (OUT)'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-semibold">{log.quantity}</td>
                          <td className="p-3.5 text-neutral-500 text-[11px]">{log.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= AUTH MODALS ================= */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-neutral-900/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 relative border border-neutral-100">
            <button
              onClick={() => setAuthModal(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-700 text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            {authModal === 'login' && (
              <div>
                <h2 className="text-xl font-light text-neutral-900 mb-1">เข้าสู่ระบบ</h2>
                <p className="text-xs text-neutral-400 mb-6">กรอกข้อมูลเพื่อเข้าสู่บัญชีของคุณ</p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1.5">อีเมล</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900 text-neutral-800 transition bg-neutral-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1.5">รหัสผ่าน</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900 text-neutral-800 transition bg-neutral-50/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-neutral-900 text-white py-3 rounded-xl text-xs font-medium hover:bg-neutral-800 transition cursor-pointer mt-2 shadow-xs"
                  >
                    เข้าสู่ระบบ
                  </button>
                </form>
                <p className="text-center text-xs text-neutral-400 mt-6">
                  ยังไม่มีบัญชีใช่ไหม?{' '}
                  <button onClick={() => setAuthModal('register')} className="text-neutral-900 font-medium hover:underline cursor-pointer">
                    สมัครสมาชิก
                  </button>
                </p>
              </div>
            )}

            {authModal === 'register' && (
              <div>
                <h2 className="text-xl font-light text-neutral-900 mb-1">สมัครสมาชิก</h2>
                <p className="text-xs text-neutral-400 mb-6">สร้างบัญชีเพื่อเริ่มช้อปปิ้ง</p>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1.5">ชื่อผู้ใช้งาน</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ชื่อของคุณ"
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900 text-neutral-800 transition bg-neutral-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1.5">อีเมล</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900 text-neutral-800 transition bg-neutral-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1.5">รหัสผ่าน</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900 text-neutral-800 transition bg-neutral-50/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-neutral-900 text-white py-3 rounded-xl text-xs font-medium hover:bg-neutral-800 transition cursor-pointer mt-2 shadow-xs"
                  >
                    สมัครสมาชิก
                  </button>
                </form>
                <p className="text-center text-xs text-neutral-400 mt-6">
                  มีบัญชีอยู่แล้วใช่ไหม?{' '}
                  <button onClick={() => setAuthModal('login')} className="text-neutral-900 font-medium hover:underline cursor-pointer">
                    เข้าสู่ระบบ
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= CART MODAL ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/30 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 border-l border-neutral-100 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="text-base font-medium text-neutral-900">ตะกร้าสินค้า ({totalCartItems})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-neutral-400 hover:text-neutral-700 text-lg font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center text-neutral-400 py-20 text-sm">
                  <span className="text-3xl block mb-2 opacity-50">🛒</span>
                  <p className="font-light">ไม่มีสินค้าในตะกร้า</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 bg-neutral-50/50 p-3 rounded-2xl border border-neutral-100">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h4 className="font-medium text-xs text-neutral-800 line-clamp-1">{item.name}</h4>
                      <p className="text-neutral-900 font-semibold text-xs mt-0.5">฿{item.price.toLocaleString()}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 bg-white border border-neutral-200 rounded-md flex items-center justify-center text-[10px] font-bold hover:bg-neutral-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-medium text-neutral-700">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 bg-white border border-neutral-200 rounded-md flex items-center justify-center text-[10px] font-bold hover:bg-neutral-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-neutral-500 font-medium">ยอดรวมทั้งหมด</span>
                  <span className="text-lg font-semibold text-neutral-900">฿{totalPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-neutral-900 text-white py-3 rounded-xl text-xs font-medium hover:bg-neutral-800 transition cursor-pointer shadow-xs"
                >
                  ดำเนินการสั่งซื้อและตัดสต็อก
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= CHATBOT WIDGET ================= */}
      <div className="fixed bottom-6 right-6 z-40">
        {isChatOpen && (
          <div className="bg-white w-80 sm:w-85 h-[420px] rounded-3xl shadow-2xl border border-neutral-100 flex flex-col mb-4 overflow-hidden">
            <div className="bg-neutral-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="text-base">💬</span>
                <div>
                  <h3 className="font-medium text-xs">kruklaapp Assistant</h3>
                  <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span> ออนไลน์
                  </span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-neutral-400 hover:text-white text-base font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50/50 text-xs">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-neutral-900 text-white rounded-br-xs' : 'bg-white text-neutral-800 border border-neutral-100 rounded-bl-xs shadow-xs'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-neutral-100 flex gap-2">
              <input
                type="text"
                placeholder="พิมพ์ข้อความ..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2 text-xs border border-neutral-200 rounded-full focus:outline-none focus:border-neutral-900 text-neutral-800 bg-neutral-50/50"
              />
              <button type="submit" className="bg-neutral-900 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-neutral-800 transition cursor-pointer">
                ส่ง
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-neutral-900 text-white w-12 h-12 rounded-full shadow-lg hover:bg-neutral-800 transition flex items-center justify-center text-xl relative cursor-pointer"
        >
          💬
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
              1
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
