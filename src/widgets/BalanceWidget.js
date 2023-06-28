import React, { useEffect, useMemo, useState } from 'react'
import CurrencyInput from 'react-currency-input-field'

export default function BalanceWidget() {
  const [balanceHistories, setBalanceHistories] = useState()
  const totalBalance = useMemo(() => {
    let total = 0
    if (balanceHistories && balanceHistories.length > 0) {
      total = balanceHistories.reduce((currentBalance, balanceHistory) => {
        if (balanceHistory.status === 'income' && balanceHistory.amount) {
          return currentBalance + +balanceHistory.amount
        } else if (
          balanceHistory.status === 'expenses' &&
          balanceHistory.amount
        ) {
          return currentBalance - +balanceHistory.amount
        } else {
          return currentBalance
        }
      }, 0)
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(total)
  }, [balanceHistories])

  useEffect(() => {
    let balanceHistories =
      JSON.parse(localStorage.getItem('balanceHistories')) || []
    if (!balanceHistories) {
      balanceHistories = []
    }
    setBalanceHistories(balanceHistories)
  }, [])

  useEffect(() => {
    if (!balanceHistories) {
      return
    }
    localStorage.setItem('balanceHistories', JSON.stringify(balanceHistories))
  }, [balanceHistories])

  return (
    <div style={{ minWidth: 300, maxHeight: 320, overflowY: 'auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'row',
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        <p>Your balance:</p>
        <p>{totalBalance}</p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'row',
        }}
      >
        <p>Transaction Histories</p>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '15px',
            cursor: 'pointer',
          }}
          onClick={() => {
            setBalanceHistories([
              ...balanceHistories,
              {
                title: '',
                amount: '',
                status: 'income',
              },
            ])
          }}
        >
          + New
        </button>
      </div>
      {balanceHistories?.length > 0 &&
        balanceHistories.map((balance, index) => {
          return (
            <div className="balance-container" key={index}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'row',
                  gap: 8,
                }}
              >
                <input
                  className="text-input"
                  placeholder="ex. Salary"
                  value={balance.title}
                  onChange={e => {
                    let _balanceHistories = [...balanceHistories]
                    _balanceHistories[index].title = e.target.value
                    setBalanceHistories(_balanceHistories)
                  }}
                />
                <CurrencyInput
                  className="text-input"
                  placeholder="$1.00"
                  decimalsLimit={2}
                  prefix="$"
                  value={balance.amount}
                  onValueChange={value => {
                    let _balanceHistories = [...balanceHistories]
                    _balanceHistories[index].amount = value
                    setBalanceHistories(_balanceHistories)
                  }}
                />
                <select
                  value={balance.status}
                  onChange={e => {
                    let _balanceHistories = [...balanceHistories]
                    _balanceHistories[index].status = e.target.value
                    setBalanceHistories(_balanceHistories)
                  }}
                >
                  <option value="income">Income</option>
                  <option value="expenses">Expenses</option>
                </select>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    let _balanceHistories = [...balanceHistories]
                    _balanceHistories.splice(index, 1)
                    setBalanceHistories(_balanceHistories)
                  }}
                >
                  X
                </button>
              </div>
            </div>
          )
        })}
    </div>
  )
}
