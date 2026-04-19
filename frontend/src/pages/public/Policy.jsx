import Layout from "../../components/Layout/Layout";

const sections = [
  {
    title: "Information We Collect",
    body: "We collect information you provide when registering, placing orders or contacting us — including your name, email address, phone number and delivery address.",
  },
  {
    title: "How We Use Your Information",
    body: "Your data is used solely to process orders, send updates and improve your shopping experience. We never sell your personal information to third parties.",
  },
  {
    title: "Data Security",
    body: "We use industry-standard encryption and secure servers to protect your personal information at all times.",
  },
  {
    title: "Cookies",
    body: "EliteMart uses cookies to keep you signed in and remember your cart. You can disable cookies in your browser settings, though some features may not work as expected.",
  },
  {
    title: "Your Rights",
    body: "You have the right to access, update or delete your personal data at any time. Contact our support team to make a request.",
  },
];

const Policy = () => (
  <Layout
    title="Privacy Policy — EliteMart"
    description="EliteMart privacy policy and data usage information"
  >
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-sm">Last updated: January 2025</p>
        <p className="text-gray-600 mt-4 leading-relaxed max-w-2xl mx-auto">
          At EliteMart, your privacy is important to us. This policy explains
          what data we collect, how we use it and how we protect your
          information.
        </p>
      </div>

      {/* Policy Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((item) => (
          <div
            key={item.title}
            className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm
                       hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition">
              {item.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

export default Policy;
