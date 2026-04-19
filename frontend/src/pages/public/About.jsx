import Layout from "../../components/Layout/Layout";

const About = () => {
  const items = [
    {
      title: "🎯 Our Mission",
      text: "Make shopping simple, enjoyable and accessible for everyone.",
    },
    {
      title: "🌟 Our Vision",
      text: "Be your go-to destination for all shopping needs, delivering quality every time.",
    },
    {
      title: "💎 Our Values",
      text: "Trust, transparency and customer-first approach in everything we do.",
    },
    {
      title: "🚀 Our Goal",
      text: "Continuously improve to bring you the best deals and products.",
    },
  ];

  return (
    <Layout title="About Us">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            About EliteMart
          </h1>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8">
            Welcome to EliteMart! We are dedicated to providing you with the
            best online shopping experience. Our goal is to offer high-quality
            products, excellent customer service and a seamless shopping
            journey.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {items.map((item) => (
              <div
                key={item.title}
                className="group bg-gray-50 rounded-xl p-5 border border-gray-100
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
