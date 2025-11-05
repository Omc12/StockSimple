import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} StockSimple. All rights reserved.</p>
                <p>Designed for small businesses to manage inventory efficiently.</p>
            </div>
        </footer>
    );
};

export default Footer;