'use client';

import Link from 'next/link';
import { useState } from 'react';

// ข้อมูลจำลองสำหรับหมวดหมู่สินค้า
const categories = [
  { id: 1, name: 'สินค้าทั้งหมด', icon: '🛍️' },
  { id: 2, name: 'เสื้อผ้าแฟชั่น', icon: '👕' },
  { id: 3, name: 'อุปกรณ์ไอที', icon: '💻' },
  { id: 4, name: 'ของใช้ในบ้าน', icon: '🏠' },
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
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>('register');

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

    // นำข้อมูลสินค้าที่สั่งซื้อมาเก็บไว้แสดงผล
    const purchasedTimestamp = new Date().toLocaleString();
    const newPurchases: PurchasedItem[] = cart.map((item) => ({
      ...item,
      purchasedAt: purchasedTimestamp,
    }));

    setProducts(updatedProducts);
    setStockLogs((prev) => [...newLogs, ...prev]);
    setRecentPurchases((prev) => [...newPurchases, ...prev]); // บันทึกข้อมูลมาแสดงตรงส่วนแสดงผลล่าสุด

    alert('สั่งซื้อสินค้าเรียบร้อยแล้ว! ระบบได้ทำการตัดสต็อกและนำข้อมูลสินค้ามาแสดงให้เรียบร้อยค่ะ');
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
    <div className="min-h-screen bg-gray-50 text-gray-800 relative">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            kruklaapp
          </Link>
          <nav className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium">หน้าแรก</Link>
            <Link href="#products" className="text-gray-600 hover:text-indigo-600 font-medium">เลือกสินค้า</Link>
            <button
              onClick={() => setIsStockModalOpen(true)}
              className="text-gray-600 hover:text-indigo-600 font-medium cursor-pointer flex items-center gap-1"
            >
              📊 บัญชีสต็อกสินค้า
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-indigo-600 cursor-pointer text-xl"
              title="ดูตะกร้าสินค้า"
            >
              🛒
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalCartItems}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">👤 {currentUser}</span>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setAuthModal('register');
                  }}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAuthModal('login')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 cursor-pointer"
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  onClick={() => setAuthModal('register')}
                  className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                >
                  สมัครสมาชิก
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            ยินดีต้อนรับสู่ kruklaapp
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            แหล่งรวมสินค้าราคาพิเศษ คัดสรรคุณภาพดีพร้อมระบบจัดการคลังสินค้ามาตรฐาน
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#products"
              className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 inline-block"
            >
              ช้อปเลยตอนนี้
            </a>
            <button
              onClick={() => setIsStockModalOpen(true)}
              className="bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-indigo-800 transition duration-300 border border-indigo-500 cursor-pointer"
            >
              📊 ตรวจสอบบัญชีสต็อก
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold mb-6">หมวดหมู่สินค้า</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer flex items-center space-x-3 border border-gray-100"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="font-medium text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold mb-6">สินค้าแนะนำ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {product.stock > 0 ? `เหลือ: ${product.stock}` : 'สินค้าหมด'}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-gray-800 mt-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-indigo-600 font-bold text-lg mt-2">
                    ฿{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-2 rounded-xl font-medium transition cursor-pointer ${
                    product.stock > 0 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'เพิ่มลงตะกร้า' : 'สินค้าหมด'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= RECENT PURCHASES SECTION (แสดงรูปและข้อมูลสินค้าที่พึ่งตัดสต็อก) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">🛍️ รายการสินค้าที่สั่งซื้อล่าสุด (ตัดสต็อกแล้ว)</h2>
        <p className="text-sm text-gray-500 mb-6">รูปและข้อมูลสินค้าที่คุณทำรายการสั่งซื้อสำเร็จจะแสดงอัปเดตตรงนี้ทันที</p>
        
        {recentPurchases.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400">
            <span className="text-4xl block mb-2">📦</span>
            <p>ยังไม่มีรายการสั่งซื้อหรือตัดสต็อกสินค้าในขณะนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentPurchases.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-indigo-100 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow">
                      ซื้อแล้ว ({item.quantity} ชิ้น)
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-gray-400 block mb-1">เวลาซื้อ: {item.purchasedAt}</span>
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                    <p className="text-indigo-600 font-bold text-base mt-2">
                      ฿{(item.price * item.quantity).toLocaleString()} <span className="text-xs text-gray-400 font-normal">(฿{item.price.toLocaleString()} / ชิ้น)</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} kruklaapp. All rights reserved.
        </div>
      </footer>

      {/* ================= STOCK LEDGER MODAL ================= */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">📊 ระบบบัญชีและสต็อกสินค้า (Stock Ledger)</h2>
              <button
                onClick={() => setIsStockModalOpen(false)}
                className="text-indigo-200 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-base">สถานะสินค้าคงเหลือปัจจุบัน</h3>
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                      <tr>
                        <th className="p-3">รหัสสินค้า</th>
                        <th className="p-3">ชื่อสินค้า</th>
                        <th className="p-3">หมวดหมู่</th>
                        <th className="p-3 text-right">ราคา</th>
                        <th className="p-3 text-right">คงเหลือ (ชิ้น)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="p-3 font-medium text-gray-500">#{p.id}</td>
                          <td className="p-3 font-semibold text-gray-800">{p.name}</td>
                          <td className="p-3 text-gray-600">{p.category}</td>
                          <td className="p-3 text-right font-medium">฿{p.price.toLocaleString()}</td>
                          <td className={`p-3 text-right font-bold ${p.stock > 5 ? 'text-green-600' : 'text-red-600'}`}>
                            {p.stock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-base">ประวัติความเคลื่อนไหว (Stock Movement Ledger)</h3>
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                      <tr>
                        <th className="p-3">วัน-เวลา</th>
                        <th className="p-3">รายการสินค้า</th>
                        <th className="p-3 text-center">ประเภท</th>
                        <th className="p-3 text-right">จำนวน</th>
                        <th className="p-3">หมายเหตุ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {stockLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="p-3 text-gray-500 text-xs">{log.date}</td>
                          <td className="p-3 font-medium text-gray-800">{log.productName}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              log.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {log.type === 'IN' ? 'รับเข้า (IN)' : 'จ่ายออก (OUT)'}
                            </span>
                          </td>
                          <td className="p-3 text-right font-bold">{log.quantity}</td>
                          <td className="p-3 text-gray-600 text-xs">{log.note}</td>
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
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            {currentUser && (
              <button
                onClick={() => setAuthModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            )}

            {authModal === 'login' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">เข้าสู่ระบบ</h2>
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">อีเมล</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">รหัสผ่าน</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 text-gray-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition cursor-pointer"
                  >
                    เข้าสู่ระบบ
                  </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-6">
                  ยังไม่มีบัญชีใช่ไหม?{' '}
                  <button onClick={() => setAuthModal('register')} className="text-indigo-600 font-semibold hover:underline cursor-pointer">
                    สมัครสมาชิก
                  </button>
                </p>
              </div>
            )}

            {authModal === 'register' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">สมัครสมาชิก</h2>
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">ชื่อผู้ใช้งาน</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ชื่อของคุณ"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">อีเมล</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">รหัสผ่าน</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 text-gray-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition cursor-pointer"
                  >
                    สมัครสมาชิกและเริ่มช้อป
                  </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-6">
                  มีบัญชีอยู่แล้วใช่ไหม?{' '}
                  <button onClick={() => setAuthModal('login')} className="text-indigo-600 font-semibold hover:underline cursor-pointer">
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
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">ตะกร้าสินค้าของคุณ ({totalCartItems})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-20">
                  <span className="text-4xl block mb-2">🛒</span>
                  <p>ยังไม่มีสินค้าในตะกร้า</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">{item.name}</h4>
                      <p className="text-indigo-600 font-bold text-sm">฿{item.price.toLocaleString()}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-bold hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-xs font-bold hover:bg-gray-100 cursor-pointer"
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
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">ยอดรวมทั้งหมด</span>
                  <span className="text-xl font-bold text-indigo-600">฿{totalPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition cursor-pointer"
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
          <div className="bg-white w-80 sm:w-96 h-[450px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden">
            <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🤖</span>
                <div>
                  <h3 className="font-bold text-sm">kruklaapp Assistant</h3>
                  <span className="text-xs text-indigo-200 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span> ออนไลน์
                  </span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-indigo-200 hover:text-white text-lg font-bold p-1 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="พิมพ์ข้อความสอบถาม..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-indigo-600 text-gray-800"
              />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition cursor-pointer">
                ส่ง
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-indigo-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center justify-center text-2xl relative cursor-pointer"
        >
          💬
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              1
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
