import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LockKeyhole, Eye, EyeOff, Loader2 } from 'lucide-react';


const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focused, setFocused] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/signup';
        const body = isLogin ? { email, password } : { username, email, password };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        setIsLoading(false);

        if (res.ok) {
            if (isLogin) {
                localStorage.setItem('username', data.username);
                navigate('/home');
            } else {
                setIsLogin(true);
            }
        } else {
            alert(data.message);
        }
    };

    

    return (
        <div className="flex flex-col md:flex-row justify-center items-center min-h-screen overflow-hidden bg-green-100 p-4">
            {/* Left Side Image */}
            
            
            {/* Right Side: Auth Form */}
            <div className="w-full md:w-1/2 flex justify-center items-center">
                <form onSubmit={handleSubmit} className="w-96 bg-white backdrop-blur-lg rounded-lg shadow-2xl p-8 border border-gray-200">
                    <h2 className="text-center text-3xl font-bold mb-6 bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </h2>
                    
                    {!isLogin && (
                        <div className={`transform transition-all duration-300 ${focused === "username" ? "scale-105" : ""}`}>
                            <label className="text-sm font-medium text-green-600 flex items-center gap-2">
                                <User size={16} className="text-green-600" /> Username
                            </label>
                            <input type="text" placeholder="Enter your Username" value={username} onFocus={() => setFocused("username")} 
                                onBlur={() => setFocused("")} onChange={(e) => setUsername(e.target.value)} required
                                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-700 placeholder-gray-400" />
                        </div>
                    )}

                    {/* Email Input */}
                    <div className={`mt-6 transform transition-all duration-300 ${focused === "email" ? "scale-105" : ""}`}>
                        <label className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <User size={16} className="text-green-600" /> Email
                        </label>
                        <input type="email" placeholder="Enter your Email" value={email} onFocus={() => setFocused("email")} 
                            onBlur={() => setFocused("")} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-700 placeholder-gray-400" />
                    </div>

                    {/* Password Input */}
                    <div className={`mt-6 transform transition-all duration-300 ${focused === "password" ? "scale-105" : ""}`}>
                        <label className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <LockKeyhole size={16} className="text-green-600" /> Password
                        </label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} placeholder="Enter your Password" value={password} 
                                onChange={(e) => setPassword(e.target.value)} onFocus={() => setFocused("password")} 
                                onBlur={() => setFocused("")} className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-700 placeholder-gray-400" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-500">
                                {!showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button type="submit" disabled={isLoading} 
                            className="w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 flex items-center justify-center gap-2">
                            {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Processing...</span></>) : (isLogin ? "Login" : "Sign Up")}
                        </button>
                    </div>

                    {/* Toggle Login/Signup */}
                    <p className="mt-4 text-center text-gray-600">
                        {isLogin ? "Don't have an account?" : "Already have an account?"} 
                        <button onClick={() => {
                            setIsLogin(!isLogin)
                            setPassword("")

                        } } className="text-green-600 font-semibold ml-1 hover:underline">
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Auth;
