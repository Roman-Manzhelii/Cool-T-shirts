// Footer.js

import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div>
                <div className="sponsors">
                    <img src="./photos/aa.png" alt=""/>
                    <img src="./photos/bdf.jpg" alt=""/>
                    <img src="./photos/tally.jpg" alt=""/>
                </div>
                <div className="additional-links">
                    <ul>
                        <li><a href="https://www2.hm.com/en_ie/index.html">H&M</a></li>
                        <li><a href="https://www.zara.com/ie/">ZARA</a></li>
                        <li><a href="https://www.dolcegabbana.com/en-ie/">Dolce & Gabana</a></li>
                        <li><a href="https://eur.shein.com/">SHIEN</a></li>
                        <li><a href="https://ie.burberry.com/">Burberry</a></li>
                        <li><a href="https://www.fendi.com/ie-en/">FENDI</a></li>
                    </ul>

                </div>

            </div>
            <div className="copyright">
                <hr/>
                <p>Copyright 2024 </p>

            </div>
        </footer>
    )
}

export default Footer
