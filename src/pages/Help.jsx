import { Header } from "../components/Header";
import { Link } from "react-router-dom";

export default function Help() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-crackterview-black mb-4">Need Help?</h1>
          <p className="text-lg text-crackterview-gray mb-8">
            This page is under construction. Please continue prompting to fill in this page content.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-crackterview-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
