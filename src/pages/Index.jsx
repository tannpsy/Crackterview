import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { LoginForm } from "../components/LoginForm";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row items-center lg:items-stretch">
            {/* Left Side - Hero Section */}
            <div className="flex-1 flex flex-col justify-center lg:pr-12 xl:pr-16">
              <Hero />
            </div>
            
            {/* Right Side - Login Form */}
            <div className="w-full lg:w-auto lg:flex-shrink-0 flex items-center justify-center lg:justify-end mt-8 lg:mt-0 lg:pl-12 xl:pl-16">
              <div className="w-full max-w-md lg:max-w-lg">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
