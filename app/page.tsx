"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Mail, Lock, User, ArrowRight, Eye, EyeClosed} from 'lucide-react';
import { login, register } from './hooks/actions';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isHide, setHide] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registerData, setRegister] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [loginData, setLogin] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const { name, value } = e.target;
    setRegister((prev) => ({...prev, [name]: value}))
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const { name, value } = e.target;
    setLogin((prev) => ({...prev, [name]: value}));
  }

  const handleSubmit = async(e:React.SubmitEvent)=> {
    e.preventDefault();
    setLoading(true);
    try {
      if(!isLogin){
      const data = await register(registerData.fullName, registerData.email, registerData.password);
      if(data.success){
        toast.success(data.message);
        setIsLogin(true);
      }
      else{
        toast.error(data.message);
      }
    }
    else{
      const data = await login(loginData.email, loginData.password);
      if(data.success){
        toast.success(data.message);
        router.push(`/utangly/${data.auth}`);
      }
      else{
        toast.error(data.message);
      }
    }
    } catch (error) {
      console.error(error);
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-sans">
      <motion.div 
        layout
        className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-sm"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground mb-4 shadow-lg shadow-primary/20">
            <Wallet size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Utangly</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLogin ? "Welcome back to your dashboard" : "Create an account to get started"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form  className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="email"
                      name='email'
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-transparent rounded-xl focus:bg-background focus:border-primary/50 transition-all outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="password"
                      name='password'
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-transparent rounded-xl focus:bg-background focus:border-primary/50 transition-all outline-none text-sm"
                    />
                  </div>
                </div>

                <button disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2">
                  <span>{loading ? "Signing In" : "Sign In"}</span>
                  {loading ? <Spinner className='size-4'/> : <ArrowRight size={18} />}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">Or</span>
                </div>
              </div>

              <p className="text-center mt-8 text-sm text-muted-foreground">
                New here?{' '}
                <button onClick={() => setIsLogin(false)} className="text-primary font-bold hover:underline">Create account</button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="text"
                      name="fullName"
                      value={registerData.fullName}
                      onChange={handleRegisterChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-transparent rounded-xl focus:bg-background focus:border-primary/50 transition-all outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type="email"
                      name="email"
                      required={true}
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-transparent rounded-xl focus:bg-background focus:border-primary/50 transition-all outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      type={isHide ? "password" : "text"}
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="Create a password"
                      className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-transparent rounded-xl focus:bg-background focus:border-primary/50 transition-all outline-none text-sm"
                    />
                   {!isHide ? <Eye onClick={() => setHide(true)} className='absolute top-2.25 right-3 z-20'/> : <EyeClosed onClick={() => setHide(false)} className='absolute top-2.25 right-3 z-20'/>}
                  </div>
                </div>

                <button disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2">
                  <span>{loading ? "Creating your account" : "Create Account"}</span>
                  {loading ? <Spinner className='size-4'/> : <ArrowRight size={18} />}
                </button>
              </form>

              <p className="text-center mt-8 text-sm text-muted-foreground">
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} className="text-primary font-bold hover:underline">Sign in</button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;
