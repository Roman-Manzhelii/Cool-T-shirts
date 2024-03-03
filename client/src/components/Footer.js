// Footer.js

import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div>
            <div className="sponsors">
            <img src="./photos/aa.png" alt="logo"/>
            <img src="./photos/bdf.jpg" alt="logo"/>
            <img src="./photos/tally.jpg" alt="logo"/>
            </div>
            <div className="additional-links">
                <ul>
                    <li><a href="/">H&M</a></li>
                    <li><a href="/about">ZARA</a></li>
                    <li><a href="/contact">Dolce & Gabana</a></li>
                    <li><a href="/">SHIEN</a></li>
                    <li><a href="/about">Burberry</a></li>
                    <li><a href="/contact">FENDI</a></li>
                </ul>

            </div>

</div>
            <div className="copyright">
            <hr />
                <p className="copyright">Copyright 2024 </p>

            </div>
        </footer>
    )
}

export default Footer
