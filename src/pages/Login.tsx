
import Layout from "@/components/layout/Layout";
import AuthForm from "@/components/auth/AuthForm";

const Login = () => {
  return (
    <Layout>
      <div className="py-12 md:py-20 civic-container">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold text-civic-blue mb-4">Welcome Back</h1>
          <p className="text-civic-gray-dark">
            Sign in to your CivicNow account to continue your civic engagement journey.
          </p>
        </div>
        
        <AuthForm />
      </div>
    </Layout>
  );
};

export default Login;
