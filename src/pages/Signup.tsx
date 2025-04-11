
import Layout from "@/components/layout/Layout";
import AuthForm from "@/components/auth/AuthForm";

const Signup = () => {
  return (
    <Layout>
      <div className="py-12 md:py-20 civic-container">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold text-civic-blue mb-4">Join CivicNow</h1>
          <p className="text-civic-gray-dark">
            Create an account to engage with your local democracy and make a difference in your community.
          </p>
        </div>
        
        <AuthForm />
      </div>
    </Layout>
  );
};

export default Signup;
