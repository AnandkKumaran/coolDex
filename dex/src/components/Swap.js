import React, { useState, useEffect } from 'react'
import { Popover, Radio, Input, Modal } from 'antd'
import {
  SettingOutlined,
  DownOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import tokenList from '../tokenList.json'
import axios from 'axios'

function Swap() {
  const [slippage, setSlippage] = useState(2.5)

  const [tokenOneAmount, setTokenOneAmount] = useState(null)
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null)

  const [tokenOne, setTokenOne] = useState(tokenList[0])
  const [tokenTwo, setTokenTwo] = useState(tokenList[1])

  const [isOpen, setIsOpen] = useState(false)
  const [changeToken, setChangeToken] = useState(1)

  const [prices, setPrices] = useState(null)

  function handleSlippageChange(e) {
    setSlippage(e.target.value)
  }

  function changeOneAmount(e) {
    setTokenOneAmount(e.target.value)

    if (e.target.value && prices) {
      setTokenTwoAmount((e.target.value * prices.ratio).toFixed(4))
    } else {
      setTokenTwoAmount(null)
    }
  }

  function changeTwoAmount(e) {
    setTokenTwoAmount(e.target.value)
  }

  function switchTokens() {
    setPrices(null)
    setTokenOneAmount(null)
    setTokenTwoAmount(null)

    const one = tokenOne
    const two = tokenTwo

    setTokenOne(two)
    setTokenTwo(one)

    fetchPrices(two.address, one.address)
  }

  function openModal(asset) {
    setChangeToken(asset)
    setIsOpen(true)
  }

  function modifyToken(i) {
    setPrices(null)
    setTokenOneAmount(null)
    setTokenTwoAmount(null)

    if (changeToken === 1) {
      setTokenOne(tokenList[i])
      fetchPrices(tokenList[i].address, tokenTwo.address)
    } else {
      setTokenTwo(tokenList[i])
      fetchPrices(tokenList[i].address, tokenOne.address)
    }
    setIsOpen(false)
  }

  async function fetchPrices(tokenOne, tokenTwo) {
    const response = await axios.get(`http://localhost:3001/tokenPrice`, {
      params: {
        addressTokenOne: tokenOne,
        addressTokenTwo: tokenTwo,
      },
    })

    setPrices(response.data)
  }

  useEffect(() => {
    fetchPrices(tokenList[0].address, tokenList[1].address)
  }, [])

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  )

  return (
    <>
      {/* Coin List Modal */}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a Token"
      >
        <div className="modalContent">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Modal>

      {/* Trade box div for swap */}
      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>

        {/* Input Boxes */}
        <div className="inputs">
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeOneAmount}
          />
          <Input
            placeholder="0"
            value={tokenTwoAmount}
            onChange={changeTwoAmount}
            disabled={true}
          />

          {/* Coin 1 selection */}
          <div className="assetOne" onClick={() => openModal(1)}>
            <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
            {tokenOne.ticker}
            <DownOutlined />
          </div>

          {/* Coin Switching */}
          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className="switchArrow" />
          </div>

          {/* Coin 2 selection */}
          <div className="assetTwo" onClick={() => openModal(2)}>
            <img src={tokenTwo.img} alt="assetTwoLogo" className="assetLogo" />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>

        {/* Swap button */}
        <div className="swapButton" disabled={!tokenOneAmount}>
          Swap
        </div>
      </div>
    </>
  )
}

export default Swap
