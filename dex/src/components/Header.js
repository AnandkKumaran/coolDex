import React from 'react'
import Logo from '../cooldex-logo.svg'
import Eth from '../eth.svg'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
      <div className="leftH">
        <img src={Logo} alt="logo" className="logo" />
        <Link to="/" className="link">
          <div className="headerItem">Swap</div>
        </Link>
        <Link to="/tokens" className="link">
          <div className="headerItem">Tokens</div>
        </Link>
      </div>
      <div className="rightH">
        <div className="headerItem">
          <img src={Eth} alt="eth" className="eth" />
          Ethereum
        </div>
        <div className="connectButton" /*onClick={connect}*/>Connect</div>
      </div>
    </header>
  )
}

export default Header
