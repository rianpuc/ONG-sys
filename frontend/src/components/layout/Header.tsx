import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import './Header.css'

const Header = () => {
    return (
        <header className="bg-gray-900">
            <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="text-2xl font-semibold whitespace-nowrap text-white">
                    <Link to="/">ONG-Sys</Link> {/* O logo também é um link para a home */}
                </div>
                <Navbar />
            </div>
        </header>
    );
};

export default Header;