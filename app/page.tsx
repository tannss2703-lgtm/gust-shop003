import Image from 'next/image';
import Link from 'next/link';

// ข้อมูลจำลองสำหรับหมวดหมู่สินค้า
const categories = [
  { id: 1, name: 'สินค้าทั้งหมด', icon: '🛍️' },
  { id: 2, name: 'เสื้อผ้าแฟชั่น', icon: '👕' },
  { id: 3, name: 'อุปกรณ์ไอที', icon: '💻' },
  { id: 4, name: 'ของใช้ในบ้าน', icon: '🏠' },
];

// ข้อมูลจำลองสำหรับสินค้า
const products = [
  {
    id: 1,
    name: 'เสื้อกันหนาว Minimal Style',
    price: 590,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80',
    category: 'เสื้อผ้าแฟชั่น',
  },
  {
    id: 2,
    name: 'หูฟังไร้สาย Noise Cancelling',
    price: 1,290,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    category: 'อุปกรณ์ไอที',
  },
  {
    id: 3,
    name: 'แก้วเก็บความเย็น 30 oz',
    price: 350,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=80',
    category: 'ของใช้ในบ้าน',
  },
  {
    id: 4,
    name: 'กระเป๋าผ้า Canvas อเนกประสงค์',
    price: 220,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80',
    category: 'เสื้อผ้าแฟชั่น',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            kruklaapp
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium">หน้าแรก</Link>
            <Link href="/products" className="text-gray-600 hover:text-indigo-600 font-medium">สินค้าทั้งหมด</Link>
            <Link href="/about" className="text-gray-600 hover:text-indigo-600 font-medium">เกี่ยวกับเรา</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-indigo-600">
              🛒
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </button>
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
            แหล่งรวมสินค้าราคาพิเศษ คัดสรรคุณภาพดีเพื่อคุณ ช้อปง่าย ส่งไว มั่นใจได้ 100%
          </p>
          <Link
            href="#products"
            className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
          >
            ช้อปเลยตอนนี้
          </Link>
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
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
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
                <button className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition">
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} kruklaapp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
