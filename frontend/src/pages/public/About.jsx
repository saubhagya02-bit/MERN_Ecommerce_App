import Layout from "../../components/Layout/Layout";

const About = () => (
  <Layout title="About Us">
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">About EShop</h1>
        <p className="text-gray-600 leading-relaxed mb-6">
          Welcome to EShop! We are dedicated to providing you with the best online
          shopping experience. Our goal is to offer high-quality products, excellent
          customer service and a seamless shopping journey.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mt-6">
          {[
            { title: "🎯 Our Mission", text: "Make shopping simple, enjoyable and accessible for everyone." },
            { title: "🌟 Our Vision",  text: "Be your go-to destination for all shopping needs, delivering quality every time." },
            { title: "💎 Our Values",  text: "Trust, transparency and customer-first approach in everything we do." },
            { title: "🚀 Our Goal",    text: "Continuously improve to bring you the best deals and products." },
          ].map(({ title, text }) => (
            <div key={title} className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
              <p className="text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Layout>
);

export default About;