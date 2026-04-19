import Layout from "../../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

const contacts = [
  { icon: <BiMailSend className="text-xl text-primary" />, label: "Email",   value: "support@eshop.com" },
  { icon: <BiPhoneCall className="text-xl text-primary" />, label: "Phone",  value: "+1 800 123 4567" },
  { icon: <BiSupport className="text-xl text-primary" />,  label: "Support", value: "24/7 Live Chat" },
];

const Contact = () => (
  <Layout title="Contact Us">
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Contact Us</h1>
        <p className="text-gray-500 mb-8">
          We&apos;d love to hear from you. Our team is always ready to help.
        </p>
        <div className="flex flex-col gap-4">
          {contacts.map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 text-left"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-gray-800 font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Layout>
);

export default Contact;