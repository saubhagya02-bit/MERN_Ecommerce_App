import Layout from "../../components/Layout/Layout";

const sections = [
  {
    title: "Information We Collect",
    body: "We collect information you provide when registering, placing orders, or contacting us — including your name, email address, phone number, and delivery address.",
  },
  {
    title: "How We Use Your Information",
    body: "Your data is used solely to process orders, send updates, and improve your shopping experience. We never sell your personal information to third parties.",
  },
  {
    title: "Data Security",
    body: "We use industry-standard encryption and secure servers to protect your personal information at all times.",
  },
  {
    title: "Cookies",
    body: "EShop uses cookies to keep you signed in and remember your cart. You can disable cookies in your browser settings, though some features may not work as expected.",
  },
  {
    title: "Your Rights",
    body: "You have the right to access, update, or delete your personal data at any time. Contact our support team to make a request.",
  },
];

const Policy = () => (
  <Layout
    title="Privacy Policy — EShop"
    description="EShop privacy policy and data usage information"
  >
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-8 text-sm">Last updated: January 2025</p>

      <p className="text-gray-600 mb-8 leading-relaxed">
        At EShop, your privacy is important to us. This policy explains what data
        we collect, how we use it, and the steps we take to protect it.
      </p>

      <div className="flex flex-col gap-8">
        {sections.map(({ title, body }) => (
          <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{body}</p>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

export default Policy;