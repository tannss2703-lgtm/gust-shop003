"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Search, Star, ArrowRight, ShieldCheck, Truck, Headphones, MessageCircle, X, Send } from "lucide-react";
import { useState } from "react";

// ข้อมูลตัวอย่างสินค้า
const products = [
  {
    id: 1,
    name: "กระเป๋าผ้าแคนวาสมินิมอล krukla รุ่น Classic",
    price: 490,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    category: "กระเป๋า",
  },
  {
    id: 2,
    name: "แก้วเก็บความเย็นสแตนเลส 304 krukla",
    price: 350,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80",
    category: "ไลฟ์สไตล์",
  },
  {
    id: 3,
    name: "เสื้อยืด Oversize ผ้าฝ้ายแท้ 100%",
    price: 290,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    category: "เสื้อผ้า",
  },
  {
    id: 4,
    name: "หมวกแก๊ปปักลายโลโก้ krukla",
    price: 250,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
    category: "เครื่องประดับ",
  },
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "สวัสดีครับ! ยินดีต้อนรับสู่ kruklaapp มีอะไรให้เราช่วยไหมครับ?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMessage("");

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "ขออภัยครับ ระบบขัดข้องชั่วคราว" },
      ]);
    } catch (error) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `ได้รับข้อความ "${userText}" แล้วครับ (โครงการ gustshop-hwep)` },
        ]);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative">
      {/* --- Header / Navbar --- */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black text-indigo-600 tracking-tight">
              krukla<span className="text-pink-500">app</span>
            </span>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="ค้นหาสินค้าที่คุณสนใจ..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-indigo-600 transition">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-pink-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </button>
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition shadow-sm"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs font-semibold uppercase tracking-wider">
              สินค้าใหม่มาแรงประจำสัปดาห์
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              ช้อปสินค้าระดับพรีเมียม <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
                ราคาสบายกระเป๋าที่ kruklaapp
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-lg">
              คัดสรรสินค้าคุณภาพดีไซน์มินิมอล ตอบโจทย์ไลฟ์สไตล์คนรุ่นใหม่ พร้อมส่งตรงถึงหน้าบ้านคุณแล้ววันนี้
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#products"
                className="px-6 py-3 bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600 transition shadow-lg shadow-pink-500/30 flex items-center space-x-2"
              >
                <span>เริ่มช้อปเลย</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80"
              alt="Hero Shopping"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* --- Features Bar --- */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">จัดส่งฟรีทั่วไทย</h4>
              <p className="text-sm text-gray-500">เมื่อช้อปครบ 500 บาทขึ้นไป</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">รับประกันคุณภาพ</h4>
              <p className="text-sm text-gray-500">คืนสินค้าได้ภายใน 7 วัน</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">บริการลูกค้า 24/7</h4>
              <p className="text-sm text-gray-500">ทีมงานพร้อมช่วยเหลือตลอดเวลา</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Product Listing Section --- */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">สินค้าแนะนำ</h2>
            <p className="text-sm text-gray-500 mt-1">สินค้าขายดีที่คัดมาเพื่อคุณโดยเฉพาะ</p>
          </div>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
            ดูทั้งหมด &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-700 shadow-xs">
                    {product.category}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-1 text-amber-400 text-sm mb-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-gray-700 font-medium text-xs">{product.rating}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition">
                    {product.name}
                  </h3>
                </div>
              </div>
              <div className="p-4 pt-0 flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-600">฿{product.price.toLocaleString()}</span>
                <button className="px-3.5 py-2 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition">
                  + เพิ่มลงรถเข็น
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-xl font-black text-white tracking-tight">
              krukla<span className="text-pink-500">app</span>
            </span>
            <p className="text-xs text-gray-500 mt-1">© 2026 kruklaapp. All rights reserved.</p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-white transition">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-white transition">เงื่อนไขการให้บริการ</a>
            <a href="#" className="hover:text-white transition">ติดต่อเรา</a>
          </div>
        </div>
      </footer>

      {/* --- Chatbot Floating Widget (Bottom-Right) --- */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Open Chat"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        ) : (
          <div className="bg-white w-80 sm:w-96 h-[480px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all">
            {/* Chat Header */}
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="font-semibold text-sm">kruklaapp Support</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-indigo-200 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-sm">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="พิมพ์ข้อความของคุณที่นี่..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
